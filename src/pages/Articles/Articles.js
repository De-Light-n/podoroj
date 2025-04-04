import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostCard from '../../components/PostCard/PostCard';
import { mainArticles } from '../../data/articles_data';
import "../../styles/Posts.css"


function Articles() {
    const halfLength = Math.ceil(mainArticles.length / 2);
    const mainArticlesToRender = mainArticles.slice(0, halfLength);
    const sidebarArticlesToRender = mainArticles.slice(halfLength);

    return (
        <div className="articles-page">
            <Header />

            <div className="header-quotes">
                <h3>Discover World With Other Eyes</h3>
                <h1>Amazing Stories and Photos</h1>
            </div>

            <div className="posts">
                <div className="cards">
                    {mainArticlesToRender.map(article => (
                        <PostCard key={article.id} article={article} isMain={true} />
                    ))}
                </div>

                <div className="sidebar">
                    <h2>Інші пости</h2>
                    {sidebarArticlesToRender.map(article => (
                        <PostCard key={article.id} article={article} isMain={false} />
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Articles;