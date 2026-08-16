import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import L from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import HeaderModal from '../../../ui/HeaderModal/HeaderModal';
import { getTags, ITagDTO } from '../../../../services/tags.service';
import { getSpecies, ISpeciesDTO } from '../../../../services/species.service';
import useAuth from '../../../../hooks/useAuth';
import Api from '../../../../utils/Api';
import Map from '../../../../utils/Map';
import rsMap from '../../../../assets/map-geojson.json';

import 'leaflet/dist/leaflet.css';
import styles from './NewThreadModal.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

interface ICoord {
    latitude: number;
    longitude: number;
}

const RS_BOUNDS = {
    north: -27.0,
    south: -33.8,
    west: -57.7,
    east: -49.6
};

const api = new Api('/api/threads');

export default function NewThreadModal({ open, onClose, onCreated }: IProps) {
    const { token } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagOptions, setTagOptions] = useState<ITagDTO[]>([]);
    const [speciesOptions, setSpeciesOptions] = useState<ISpeciesDTO[]>([]);
    const [selectedTags, setSelectedTags] = useState<ITagDTO[]>([]);
    const [selectedSpecies, setSelectedSpecies] = useState<ISpeciesDTO[]>([]);
    const [speciesSearch, setSpeciesSearch] = useState('');
    const [coords, setCoords] = useState<ICoord | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        let mounted = true;

        async function loadTags() {
            const tags = await getTags();
            if (!mounted) return;
            setTagOptions(tags);
        }

        void loadTags();

        return () => {
            mounted = false;
        };
    }, [open]);

    const tagSelectOptions = useMemo(() => {
        const selectedIds = new Set(selectedTags.map(tag => tag.id));
        return tagOptions.filter(tag => !selectedIds.has(tag.id));
    }, [selectedTags, tagOptions]);

    const speciesSelectOptions = useMemo(() => {
        const selectedIds = new Set(selectedSpecies.map(specie => specie.id));
        return speciesOptions.filter(specie => !selectedIds.has(specie.id));
    }, [selectedSpecies, speciesOptions]);

    function handleAddTag(tag: ITagDTO) {
        setSelectedTags(current => {
            if (current.some(item => item.id === tag.id)) return current;
            return [...current, tag];
        });
    }

    function handleRemoveTag(tagId: number) {
        setSelectedTags(current => current.filter(tag => tag.id !== tagId));
    }

    function handleAddSpecies(specie: ISpeciesDTO) {
        setSelectedSpecies(current => [...current, specie]);
        setSpeciesSearch('');
        setSpeciesOptions([]);
    }

    function handleRemoveSpecies(specieId: number) {
        setSelectedSpecies(current => current.filter(specie => specie.id !== specieId));
    }

    function updateCoordsFromBrowser() {
        if (!navigator.geolocation) {
            setStatusMessage('Seu navegador não suporta geolocalização.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                if (
                    latitude < RS_BOUNDS.south ||
                    latitude > RS_BOUNDS.north ||
                    longitude < RS_BOUNDS.west ||
                    longitude > RS_BOUNDS.east
                ) {
                    setStatusMessage(
                        'A localização atual está fora do limite do Rio Grande do Sul.'
                    );
                    return;
                }

                setCoords({ latitude, longitude });
                setStatusMessage('Localização atual selecionada com sucesso.');
            },
            () => {
                setStatusMessage('Não foi possível acessar sua localização.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!token) {
            setStatusMessage('Você precisa estar logado para criar uma discussão.');
            return;
        }

        if (!title.trim() || !description.trim()) {
            setStatusMessage('Título e descrição são obrigatórios.');
            return;
        }

        if (selectedTags.length === 0 || selectedSpecies.length === 0) {
            setStatusMessage('Selecione pelo menos uma tag e uma espécie.');
            return;
        }

        if (!coords) {
            setStatusMessage('Selecione uma localização no mapa ou use sua localização atual.');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            await api.post<{ success: boolean; insertId?: number }>('/', {
                headers: new Headers({ authorization: `Bearer ${token}` }),
                body: {
                    title: title.trim(),
                    description: description.trim(),
                    tags: selectedTags.map(tag => tag.id),
                    species: selectedSpecies.map(specie => specie.id),
                    coords: {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    }
                }
            });

            setStatusMessage('Discussão criada com sucesso!');
            setTitle('');
            setDescription('');
            setSelectedTags([]);
            setSelectedSpecies([]);
            setCoords(null);
            setSpeciesSearch('');
            if (onCreated) onCreated();
            onClose();
        } catch {
            setStatusMessage('Não foi possível criar a discussão. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const mapRef = useRef<Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open || !mapContainerRef.current || mapRef.current) return;

        const instance = new Map(mapContainerRef.current);
        mapRef.current = instance;

        instance.renderGeoJSON(rsMap as GeoJsonObject, {
            fitBounds: true,
            style: {
                color: '#2563eb',
                weight: 1.5,
                fillColor: '#60a5fa',
                fillOpacity: 0.18
            }
        });

        const leafletMap = (instance as unknown as { map: L.Map }).map;
        leafletMap.on('click', (event: L.LeafletMouseEvent) => {
            const { lat, lng } = event.latlng;
            const latitude = Math.min(Math.max(lat, RS_BOUNDS.south), RS_BOUNDS.north);
            const longitude = Math.min(Math.max(lng, RS_BOUNDS.west), RS_BOUNDS.east);
            setCoords({ latitude, longitude });
        });

        return () => {
            instance.destroy();
            mapRef.current = null;
        };
    }, [open]);

    useEffect(() => {
        if (!mapRef.current) return;

        const markerLayer = (mapRef.current as unknown as { markerLayer: L.LayerGroup })
            .markerLayer;
        markerLayer.clearLayers();

        if (!coords) return;

        const marker = L.circleMarker([coords.latitude, coords.longitude], {
            radius: 8,
            color: '#d9480f',
            fillColor: '#f97316',
            fillOpacity: 0.9,
            weight: 3
        }).addTo(markerLayer);

        marker.bindPopup(
            `Selecionado: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
        );
        marker.openPopup();
    }, [coords]);

    useEffect(() => {
        if (!open) return;

        const query = speciesSearch.trim();

        if (!query) {
            setSpeciesOptions([]);
            setIsSpeciesLoading(false);
            return;
        }

        let isActive = true;
        setIsSpeciesLoading(true);

        const timeout = window.setTimeout(async () => {
            try {
                const results = await getSpecies(query);
                if (!isActive) return;

                setSpeciesOptions(
                    results.filter(specie => !selectedSpecies.some(item => item.id === specie.id))
                );
            } finally {
                if (isActive) setIsSpeciesLoading(false);
            }
        }, 250);

        return () => {
            isActive = false;
            window.clearTimeout(timeout);
        };
    }, [open, speciesSearch, selectedSpecies]);

    return (
        <HeaderModal title="Nova discussão" open={open} onClose={onClose}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <fieldset className={styles.fieldset}>
                    <label htmlFor="thread-title">Título</label>
                    <input
                        id="thread-title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ex.: Tartaruga vista na costa norte"
                    />
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <label htmlFor="thread-description">Descrição</label>
                    <textarea
                        id="thread-description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Descreva o ocorrido..."
                    />
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <label>Tags</label>
                    <select
                        className={styles.tagSelect}
                        value=""
                        onChange={event => {
                            const value = Number(event.target.value);
                            if (!value) return;

                            const selectedTag = tagOptions.find(tag => tag.id === value);
                            if (!selectedTag) return;

                            handleAddTag(selectedTag);
                            event.target.value = '';
                        }}
                    >
                        <option value="">Selecionar tag</option>
                        {tagSelectOptions.map(tag => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>

                    <div className={styles.selectedChips}>
                        {selectedTags.length === 0 ? (
                            <span className={styles.emptySelection}>Nenhuma tag selecionada</span>
                        ) : (
                            selectedTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={styles.chip}
                                    onClick={() => handleRemoveTag(tag.id)}
                                    title={`Remover ${tag.name}`}
                                >
                                    {tag.name}
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            ))
                        )}
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <label>Espécies</label>
                    <div className={styles.searchableSelectWrap}>
                        <input
                            type="text"
                            value={speciesSearch}
                            onChange={e => setSpeciesSearch(e.target.value)}
                            placeholder="Digite para buscar espécies..."
                        />

                        {speciesSearch.trim() && (
                            <div className={styles.searchableDropdown}>
                                {isSpeciesLoading ? (
                                    <span className={styles.emptyOption}>Buscando espécies...</span>
                                ) : speciesSelectOptions.length > 0 ? (
                                    speciesSelectOptions.map(specie => (
                                        <button
                                            key={specie.id}
                                            type="button"
                                            className={styles.optionButton}
                                            onClick={() => handleAddSpecies(specie)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            {specie.name}
                                        </button>
                                    ))
                                ) : (
                                    <span className={styles.emptyOption}>
                                        Nenhuma espécie encontrada
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.selectedChips}>
                        {selectedSpecies.length === 0 ? (
                            <span className={styles.emptySelection}>
                                Nenhuma espécie selecionada
                            </span>
                        ) : (
                            selectedSpecies.map(specie => (
                                <button
                                    key={specie.id}
                                    type="button"
                                    className={styles.chip}
                                    onClick={() => handleRemoveSpecies(specie.id)}
                                    title={`Remover ${specie.name}`}
                                >
                                    {specie.name}
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            ))
                        )}
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <label>Localização</label>
                    <div className={styles.mapActions}>
                        <button
                            type="button"
                            className={styles.locationButton}
                            onClick={updateCoordsFromBrowser}
                        >
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            Usar minha localização
                        </button>
                    </div>

                    <div ref={mapContainerRef} className={styles.mapPreview} />

                    <small>
                        {coords
                            ? `Selecionado: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
                            : 'Selecione uma localização no mapa ou use sua posição atual.'}
                    </small>
                </fieldset>

                {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Criando...' : 'Criar Discussão'}
                </button>
            </form>
        </HeaderModal>
    );
}
