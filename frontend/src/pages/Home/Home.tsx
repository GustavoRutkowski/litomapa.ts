import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faBinoculars,
    faBookOpen,
    faChartLine,
    faChevronDown,
    faFish,
    faGlobe,
    faMapLocationDot,
    faPeopleGroup,
    faSeedling,
    faWater
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import logoUrl from '../../assets/logo.png';
import styles from './Home.module.scss';

const audiences = [
    {
        icon: faBinoculars,
        title: 'Turistas',
        text: 'Descubra a vida marinha que torna cada paisagem do litoral gaúcho única.'
    },
    {
        icon: faPeopleGroup,
        title: 'Comunidades locais',
        text: 'Registre avistamentos e ajude a proteger o ambiente onde você vive.'
    },
    {
        icon: faFish,
        title: 'Pescadores',
        text: 'Compartilhe conhecimento de campo e acompanhe mudanças no ecossistema.'
    },
    {
        icon: faBookOpen,
        title: 'Universitários',
        text: 'Encontre dados que aproximam a pesquisa científica da realidade costeira.'
    }
];

const steps = [
    {
        number: '01',
        title: 'Explore o mapa',
        text: 'Veja onde as espécies foram observadas no Rio Grande do Sul.'
    },
    {
        number: '02',
        title: 'Registre a natureza',
        text: 'Compartilhe um avistamento, uma foto ou uma ocorrência.'
    },
    {
        number: '03',
        title: 'Construa conhecimento',
        text: 'Converse com a comunidade e transforme dados em cuidado.'
    }
];

export default function Home() {
    return (
        <div className={styles.page}>
            <header className={styles.navbar}>
                <a className={styles.brand} href="#inicio" aria-label="LitoMapa - início">
                    <img src={logoUrl} alt="" />
                    <span>
                        Lito<span>Mapa</span>
                    </span>
                </a>

                <nav className={styles.navLinks} aria-label="Navegação principal">
                    <a href="#sobre">Sobre o projeto</a>
                    <a href="#como-funciona">Como funciona</a>
                    <a href="#comunidade">Comunidade</a>
                </nav>

                <div className={styles.navActions}>
                    <Link to="/login" className={styles.loginLink}>
                        Entrar
                    </Link>
                    <Link to="/register" className={styles.navCta}>
                        Criar conta <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </header>

            <main>
                <section id="inicio" className={styles.hero}>
                    <div className={styles.heroContent}>
                        <p className={styles.eyebrow}>
                            <span /> Ciência cidadã pelo litoral gaúcho
                        </p>
                        <h1>
                            O litoral é vivo.
                            <br />
                            <em>Vamos conhecê-lo.</em>
                        </h1>
                        <p className={styles.heroText}>
                            Uma rede para observar, registrar e proteger as espécies marinhas e
                            costeiras que fazem parte do Rio Grande do Sul.
                        </p>
                        <div className={styles.heroActions}>
                            <Link to="/dashboard" className={styles.primaryButton}>
                                Explorar o mapa <FontAwesomeIcon icon={faMapLocationDot} />
                            </Link>
                            <a href="#sobre" className={styles.textButton}>
                                Conheça o LitoMapa <FontAwesomeIcon icon={faArrowRight} />
                            </a>
                        </div>
                        <div className={styles.trustLine}>
                            <div className={styles.avatarStack} aria-hidden="true">
                                <span>✦</span>
                                <span>◌</span>
                                <span>≈</span>
                            </div>
                            <span>Feito para quem vive e cuida da costa</span>
                        </div>
                    </div>

                    <div
                        className={styles.heroVisual}
                        aria-label="Ilustração de um ecossistema costeiro"
                    >
                        <div className={styles.sun} />
                        <div className={`${styles.orbit} ${styles.orbitOne}`} />
                        <div className={`${styles.orbit} ${styles.orbitTwo}`} />
                        <div className={styles.visualCard}>
                            <div className={styles.cardTop}>
                                <span>
                                    <i /> AVISTAMENTO RECENTE
                                </span>
                                <b>●</b>
                            </div>
                            <div className={styles.whale}>
                                <FontAwesomeIcon icon={faFish} />
                            </div>
                            <strong>Baleia-franca-austral</strong>
                            <span>Praia do Cassino, RS</span>
                            <div className={styles.cardMeta}>
                                <span>Hoje, 08:42</span>
                                <span>● Confirmado</span>
                            </div>
                        </div>
                        <div className={styles.floatingBadge}>
                            <FontAwesomeIcon icon={faWater} />
                            <span>
                                <b>+ 248</b>
                                <small>observações este mês</small>
                            </span>
                        </div>
                        <div className={styles.bubbles}>
                            <i />
                            <i />
                            <i />
                            <i />
                        </div>
                    </div>
                    <a href="#sobre" className={styles.scrollHint}>
                        <span>role para explorar</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </a>
                </section>

                <section className={styles.metrics} aria-label="Números do projeto">
                    <div>
                        <strong>497</strong>
                        <span>espécies catalogadas</span>
                    </div>
                    <div>
                        <strong>62</strong>
                        <span>municípios costeiros</span>
                    </div>
                    <div>
                        <strong>1.8k</strong>
                        <span>observações registradas</span>
                    </div>
                    <div>
                        <strong>∞</strong>
                        <span>possibilidades de descoberta</span>
                    </div>
                </section>

                <section id="sobre" className={`${styles.section} ${styles.about}`}>
                    <div className={styles.sectionLabel}>
                        <span>01</span> O projeto
                    </div>
                    <div className={styles.aboutGrid}>
                        <h2>
                            Conhecer é o<br />
                            <em>primeiro passo</em>
                            <br />
                            para proteger.
                        </h2>
                        <div>
                            <p>
                                O LitoMapa conecta pessoas e conhecimento para tornar visível a
                                biodiversidade do litoral do Rio Grande do Sul.
                            </p>
                            <p>
                                Em um só lugar, você encontra registros, compartilha descobertas e
                                acompanha as transformações da nossa fauna marinha e costeira.
                            </p>
                            <Link to="/register" className={styles.arrowLink}>
                                Faça parte dessa rede <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </div>
                    </div>
                    <div className={styles.values}>
                        <div>
                            <FontAwesomeIcon icon={faGlobe} />
                            <span>
                                <b>Território</b>
                                <small>Dados sobre o nosso litoral</small>
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faSeedling} />
                            <span>
                                <b>Conservação</b>
                                <small>Informação que gera cuidado</small>
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faChartLine} />
                            <span>
                                <b>Ciência</b>
                                <small>Pesquisa aberta e colaborativa</small>
                            </span>
                        </div>
                    </div>
                </section>

                <section id="comunidade" className={`${styles.section} ${styles.audience}`}>
                    <div className={styles.sectionLabel}>
                        <span>02</span> Para toda a costa
                    </div>
                    <div className={styles.sectionHeading}>
                        <h2>
                            Todo olhar
                            <br />
                            <em>faz diferença.</em>
                        </h2>
                        <p>
                            A biodiversidade também é feita pelas histórias de quem está perto dela.
                        </p>
                    </div>
                    <div className={styles.audienceGrid}>
                        {audiences.map(audience => (
                            <article key={audience.title}>
                                <div className={styles.audienceIcon}>
                                    <FontAwesomeIcon icon={audience.icon} />
                                </div>
                                <h3>{audience.title}</h3>
                                <p>{audience.text}</p>
                                <span className={styles.smallArrow}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="como-funciona" className={`${styles.section} ${styles.howItWorks}`}>
                    <div className={styles.sectionLabel}>
                        <span>03</span> Em três movimentos
                    </div>
                    <div className={styles.sectionHeading}>
                        <h2>
                            Da observação
                            <br />
                            <em>à transformação.</em>
                        </h2>
                        <p>Uma plataforma simples para você participar da conservação.</p>
                    </div>
                    <div className={styles.steps}>
                        {steps.map(step => (
                            <div className={styles.step} key={step.number}>
                                <strong>{step.number}</strong>
                                <span />
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.finalCta}>
                    <div className={styles.ctaGlow} />
                    <p className={styles.eyebrow}>
                        <span /> A costa precisa de todos nós
                    </p>
                    <h2>
                        Seu próximo encontro
                        <br />
                        com a natureza <em>começa aqui.</em>
                    </h2>
                    <Link to="/register" className={styles.lightButton}>
                        Entrar para o LitoMapa <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </section>
            </main>

            <footer className={styles.footer}>
                <span>© {new Date().getFullYear()} LitoMapa</span>
                <span>
                    Feito com curiosidade e cuidado pelo litoral gaúcho{' '}
                    <FontAwesomeIcon icon={faWater} />
                </span>
                <a href="#inicio">Voltar ao topo ↑</a>
            </footer>
        </div>
    );
}
