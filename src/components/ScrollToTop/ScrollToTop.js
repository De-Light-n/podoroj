// filepath: c:\Projects\My_repo\webLabPodoroj\podoroj\src\components\ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // Прокручуємо сторінку до верхньої частини
    }, [pathname]);

    return null;
}

export default ScrollToTop;