import React, { useState } from 'react';
import PostCard from '../../components/PostCard/PostCard';
import { mainArticles } from '../../data/articles_data';
import "./Articles.css";
import "../../styles/Posts.css";

function Articles() {
    const [sortBy, setSortBy] = useState('date-desc');
    const halfLength = Math.ceil(mainArticles.length / 2);
    
    const parseDate = (dateStr) => {
        const [time, date] = dateStr.split(' ');
        const [hours, minutes] = time.split('.');
        const [day, month, year] = date.split('.');
        return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
    };

    const sortArticles = (articles) => {
        const sorted = [...articles];
        
        switch(sortBy) {
            case 'date-asc':
                sorted.sort((a, b) => parseDate(a.time) - parseDate(b.time));
                break;
            case 'date-desc':
                sorted.sort((a, b) => parseDate(b.time) - parseDate(a.time));
                break;
            case 'likes-asc':
                sorted.sort((a, b) => (a.likes || 0) - (b.likes || 0));
                break;
            case 'likes-desc':
                sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'title-asc':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'comments-asc':
                sorted.sort((a, b) => (a.comments?.length || 0) - (b.comments?.length || 0));
                break;
            case 'comments-desc':
                sorted.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
                break;
            default:
                break;
        }
        
        return sorted;
    };

    const sortedArticles = sortArticles(mainArticles);
    const mainArticlesToRender = sortedArticles.slice(0, halfLength);
    const sidebarArticlesToRender = sortedArticles.slice(halfLength);

    return (
        <div className="articles-page">
            <div className="header-quotes">
                <h3>Дивись на світ іншими очима</h3>
                <h1>Дивовижні історії та фото</h1>
            </div>

            <div className="sort-controls">
                <div className="sort-container">
                    <svg className="sort-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M9 17H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <optgroup label="Дата">
                            <option value="date-desc">Новіші спочатку</option>
                            <option value="date-asc">Старіші спочатку</option>
                        </optgroup>
                        <optgroup label="Лайки">
                            <option value="likes-desc">Найпопулярніші</option>
                            <option value="likes-asc">Найменш популярні</option>
                        </optgroup>
                        <optgroup label="Назва">
                            <option value="title-asc">А-Я</option>
                            <option value="title-desc">Я-А</option>
                        </optgroup>
                        <optgroup label="Коментарі">
                            <option value="comments-desc">Більше коментарів</option>
                            <option value="comments-asc">Менше коментарів</option>
                        </optgroup>
                    </select>
                    <div className="select-arrow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
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
        </div>
    );
}

export default Articles;