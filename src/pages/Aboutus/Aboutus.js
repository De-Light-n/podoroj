import React from 'react';
import "../../styles/styles.css";
import './Aboutus.css';

function AboutUs() {
    return (
        <div className="about-us-page">
            <header>
                <div className="hero">
                    <h3>Дивись на світ з нами</h3>
                    <h1>Дивовижні історії та фото</h1>
                    <a className="cta-button" href="/articles">Discover More</a>
                </div>
            </header>

            <div className="about-us">
                <section className="intro-block">
                    <div className="about-header">
                        <h1 className="about-title">Про нас</h1>
                    </div>
                    <p className="text-holder">
                        Ми – команда мандрівників, які обожнюють відкривати нові горизонти та
                        ділитися своїм досвідом з іншими. Наш блог – це джерело натхнення,
                        корисних порад і незабутніх історій з усього світу.
                    </p>
                </section>

                <section className="mission-block">
                    <h2 className="section-title">Наша місія</h2>
                    <p className="text-holder">
                        Ми прагнемо показати, що подорожі доступні кожному. Наші статті
                        допоможуть вам знайти бюджетні маршрути, корисні лайфхаки та мотивацію
                        для відкриття нових країн.
                    </p>
                </section>

                <section className="content-block">
                    <h2 className="section-title">Що ви знайдете в нашому блозі</h2>
                    <div className="features-list">
                        <div className="feature-item">
                            <h3>Огляди міст і країн</h3>
                            <p>Детальні описи місць, які ми відвідали з особистим досвідом.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Поради щодо бюджетних подорожей</h3>
                            <p>Як подорожувати якісно, але не дорого.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Ідеї для пригод та активного відпочинку</h3>
                            <p>Нетипові маршрути та активності для справжніх шукачів пригод.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Лайфхаки для комфортних мандрівок</h3>
                            <p>Перевірені способи зробити вашу подорож зручнішою.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Особисті історії та культурні відкриття</h3>
                            <p>Наші враження та спостереження з різних куточків світу.</p>
                        </div>
                    </div>
                </section>

                <section className="team-block">
                    <h2 className="section-title">Наша команда (спойлер: це я)</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <h3>🗺️ Назар – мандрівник</h3>
                            <p>
                                Планую маршрути, шукаю бюджетні авіаквитки, ночую в наметі під
                                зорями або в хостелі за три долари – все заради нових вражень та
                                історій для блогу.
                            </p>
                        </div>
                        <div className="team-member">
                            <h3>🌍 Назар – фотограф</h3>
                            <p>
                                Від Полярного сяйва до вузьких вуличок Марракеша – фіксую красу
                                світу у фото та відео, щоб передати атмосферу кожної подорожі.
                            </p>
                        </div>
                        <div className="team-member">
                            <h3>✈️ Назар – блогер</h3>
                            <p>
                                Пишу тексти, ділюся лайфхаками, розповідаю про місця, де їв
                                найкращу вуличну їжу, і допомагаю іншим знайти свої ідеальні
                                маршрути.
                            </p>
                        </div>
                        <div className="team-member">
                            <h3>💻 Назар – розробник</h3>
                            <p>
                                Створив цей сайт, щоб всі ці історії знайшли своє місце. Коли не в
                                подорожі, коджу, тестую та додаю нові фішки, щоб вам було зручно
                                тут.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="why-us-block">
                    <h2 className="section-title">Чому ми?</h2>
                    <p>
                        Ми не просто пишемо про подорожі – ми живемо ними! Кожен маршрут ми
                        перевіряємо особисто, кожна порада випробувана на власному досвіді.
                    </p>
                </section>

                <section className="testimonials-section">
                    <h2 className="section-title">Відгуки, що надихають</h2>

                    <div className="testimonials-scroller">
                        <div className="testimonials-track">
                            <div className="testimonial-card">
                                <div className="stars">★★★★★</div>
                                <p className="testimonial-text">
                                    Цей блог відкрив для мене світ подорожей! Тут завжди знаходжу
                                    корисні поради та натхнення для нових пригод. Не можу не
                                    рекомендувати його іншим мандрівникам!
                                </p>
                                <p className="author">Леонардо да Вінчі</p>
                            </div>

                            <div className="testimonial-card">
                                <div className="stars">★★★★★</div>
                                <p className="testimonial-text">
                                    Коли шукав ідеї для подорожей, цей блог став справжнім скарбом.
                                    Статті детальні, цікаві та наповнені практичними рекомендаціями.
                                </p>
                                <p className="author">Тимур Конг</p>
                            </div>

                            <div className="testimonial-card">
                                <div className="stars">★★★★★</div>
                                <p className="testimonial-text">
                                    На відміну від інших сайтів, тут діляться не просто популярними
                                    маршрутами, а дійсно унікальними локаціями та секретними
                                    місцями, які варто відвідати.
                                </p>
                                <p className="author">Катерина Стоод</p>
                            </div>

                            <div className="testimonial-card">
                                <div className="stars">★★★★★</div>
                                <p className="testimonial-text">
                                    Завдяки цьому блогу моя остання подорож була ідеальною! Корисні
                                    лайфхаки, неймовірні фото та чесні відгуки – саме те, що
                                    потрібно кожному мандрівнику.
                                </p>
                                <p className="author">Жанна Бірч</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUs;