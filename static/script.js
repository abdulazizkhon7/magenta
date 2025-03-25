let currentPage = 1;
const itemsPerPage = 10;

// Update price display with proper formatting
function updatePriceDisplay(value) {
    document.getElementById('priceDisplay').innerText = '¥' + new Intl.NumberFormat('ja-JP').format(value);
}

// Fetch data based on the page number
function fetchData(page) {
    fetch(`/data?page=${page}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('schoolList');
            container.innerHTML = '';
            data.data.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('school-card');

                div.innerHTML = `
                    <div class="school-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="school-content">
                        <h3>${item.name}</h3>
                        <div class="rating">
                            <span>⭐</span>
                            <span>${item.rating}</span>
                        </div>
                        <div class="school-details">
                            <div class="detail-item">
                                <span>📍</span>
                                <span >${item.location}</span>
                            </div>
                            <div class="detail-item">
                                <span>💴</span>
                                <span>${item.tuition}</span>
                            </div>
                            <div class="detail-item">
                                <span>📅</span>
                                <span>${item.duration}</span>
                            </div>
                            <div class="detail-item">
                                <span>📚</span> ${item.course_types}
                            </div>
                        </div>
                        <p class="school-description"><span>〒</span>${item.features}</p>
                        
                        <button class="button" onclick="window.open('${item.website}', '_blank')" data-lang="アクセス">アクセス</button>
                    </div>
                `;
                container.appendChild(div);
            });

            // Update page information
            document.getElementById('current-page').textContent = `Page ${data.page}`;

            // Enable/Disable pagination buttons
            document.getElementById('prev-page').disabled = (data.page === 1);
            document.getElementById('next-page').disabled = (data.page * itemsPerPage >= data.total);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Handle page changes
function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }
    fetchData(currentPage);  // Fetch data for the new page
}

// Handle form input filtering
document.getElementById('filterForm').addEventListener('input', function () {
    const formData = new FormData(this);
    const params = new URLSearchParams(formData).toString();

    fetch(`/filter?${params}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('schoolList').innerHTML = html;
        })
        .catch(error => console.error("Error filtering schools:", error));
});

// Handle dark mode toggle
document.getElementById("darkMode").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
});

// Handle the submit event of the filter form
document.getElementById("filterForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    const formData = new FormData(this);
    const queryString = new URLSearchParams(formData).toString();

    fetch(`/filter?${queryString}`)
        .then(response => response.text())
        .then(html => {
            document.querySelector(".main-container").innerHTML = html;
        })
        .catch(error => console.error("Error:", error));
});

const translations = {
    ja: {
        logo: "日本語学校検索",
        "lang-ja": "日本語",
        "lang-en": "English",
        "lang-mn": "Mongolia",
        "region-label": "地域",
        "region-text": "全ての地域",
        "search-placeholder": "学校を検索",
        "search-button": "🔍",
        "price-label": "学費",
        "course-type-label": "コースタイプ",
        "long-term": "長期",
        "short-term": "短期",
        "dormitory": "寮完備",
        "scholarship": "奨学金制度",
        "access-button": "アクセス",
        "no-results": "該当する学校が見つかりませんでした。",
        "price-fees": "以内",
        "Search Criteria": "検索条件",
        "東京都": "東京都",
        "大阪府": "大阪府",
        "福岡県": "福岡県",
        "京都府": "京都府",
        "北海道": "北海道",
        "愛知県": "愛知県",
        "茨城県": "茨城県",
        "埼玉県": "埼玉県",
        "千葉県": "千葉県",
        "兵庫県": "兵庫県",
        "新潟県": "新潟県",
        "福島県": "福島県",
        "栃木県": "栃木県",
        "群馬県": "群馬県",
        "神奈川県": "神奈川県",
        "長野県": "長野県",
        "富山県": "富山県",
        "石川県": "石川県",
        "岐阜県": "岐阜県",
        "静岡県": "静岡県",
        "奈良県": "奈良県",
        "和歌山県": "和歌山県",
        "鳥取県": "鳥取県",
        "島根県": "島根県",
        "岡山県": "岡山県",
        "広島県": "広島県",
        "山口県": "山口県",
        "愛媛県": "愛媛県",
        "熊本県": "熊本県",
        "沖縄県": "沖縄県",
        "宮城県": "宮城県",
        "img1": "日本語を一緒に学びましょう！",
        "img2": "日本語を楽しく学ぼう！",
        "img3": "みんなで日本語を勉強しましょう！",
        "img4": "日本語を学んで、新しい世界を広げよう！",
        "prev": "前へ",
        "next": "次へ",
        "アクセス": "アクセス"

    },
    en: {
        logo: "Japanese School Search",
        "lang-ja": "Japanese",
        "lang-en": "English",
        "lang-mn": "Mongolia",
        "region-label": "Region",
        "region-text": "All Regions",
        "search-placeholder": "Search for schools",
        "search-button": "🔍",
        "price-label": "Tuition",
        "course-type-label": "Course Type",
        "long-term": "Long Term",
        "short-term": "Short Term",
        "dormitory": "Dormitory",
        "scholarship": "Scholarship",
        "access-button": "Access",
        "no-results": "No schools found.",
        "price-fees": "Up to ",
        "Search Criteria": "Search Criteria",
        "東京都": "Tokyo",
        "大阪府": "Osaka",
        "福岡県": "Fukuoka",
        "京都府": "Kyoto",
        "北海道": "Hokkaido",
        "愛知県": "Aichi",
        "茨城県": "Ibaraki",
        "埼玉県": "Saitama",
        "千葉県": "Chiba",
        "兵庫県": "Hyogo",
        "新潟県": "Niigata",
        "福島県": "Fukushima",
        "栃木県": "Tochigi",
        "群馬県": "Gunma",
        "神奈川県": "Kanagawa",
        "長野県": "Nagano",
        "富山県": "Toyama",
        "石川県": "Ishikawa",
        "岐阜県": "Gifu",
        "静岡県": "Shizuoka",
        "奈良県": "Nara",
        "和歌山県": "Wakayama",
        "鳥取県": "Tottori",
        "島根県": "Shimane",
        "岡山県": "Okayama",
        "広島県": "Hiroshima",
        "山口県": "Yamaguchi",
        "愛媛県": "Ehime",
        "熊本県": "Kumamoto",
        "沖縄県": "Okinawa",
        "宮城県": "Miyagi",
        "img1": "Let's learn Japanese together!",
        "img2": "Learn Japanese with fun!",
        "img3": "Let's study Japanese together!",
        "img4": "Learn Japanese and expand your horizons!",
        "prev": "Prev",
        "next": "Next",
        "アクセス": "Access"
        // Add more translations here
    },
    uzb: {
        "logo": "Yapon maktablarini qidirish",
        "region-label": "Hudud",
        "region-text": "Barcha hududlar",
        "search-placeholder": "Maktablarni qidirish",
        "search-button": "🔍",
        "price-label": "O‘qish narxi",
        "course-type-label": "Kurs turi",
        "long-term": "Uzoq muddatli",
        "short-term": "Qisqa muddatli",
        "dormitory": "Yotoqxona",
        "scholarship": "Stipendiya",
        "access-button": "Kirish",
        "no-results": "Maktablar topilmadi.",
        "price-fees": "gacha ",
        "Search Criteria": "Qidiruv mezonlari",
        "東京都": "Tokio",
        "大阪府": "Osaka",
        "福岡県": "Fukuoka",
        "京都府": "Kyoto",
        "北海道": "Hokkaydo",
        "愛知県": "Aichi",
        "茨城県": "Ibaraki",
        "埼玉県": "Saitama",
        "千葉県": "Chiba",
        "兵庫県": "Hyogo",
        "新潟県": "Niigata",
        "福島県": "Fukushima",
        "栃木県": "Tochigi",
        "群馬県": "Gunma",
        "神奈川県": "Kanagawa",
        "長野県": "Nagano",
        "富山県": "Toyama",
        "石川県": "Ishikawa",
        "岐阜県": "Gifu",
        "静岡県": "Shizuoka",
        "奈良県": "Nara",
        "和歌山県": "Wakayama",
        "鳥取県": "Tottori",
        "島根県": "Shimane",
        "岡山県": "Okayama",
        "広島県": "Hiroshima",
        "山口県": "Yamaguchi",
        "愛媛県": "Ehime",
        "熊本県": "Kumamoto",
        "沖縄県": "Okinawa",
        "宮城県": "Miyagi",
        "img1": "Keling, yapon tilini birga o‘rganamiz!",
        "img2": "Yapon tilini zavq bilan o‘rganing!",
        "img3": "Yapon tilini birga o‘rganaylik!",
        "img4": "Yapon tilini o‘rganing va ufqingizni kengaytiring!",
        "prev": "Oldingi",
        "next": "Keyingi",
        "アクセス": "Kirish"
    },    
    mn: {
        "logo": "Японы Сургуулийн Хайлт",
        "lang-ja": "日本語",
        "lang-en": "english",
        "lang-mn": "mongolia",
        "region-label": "Бүс нутгийн",
        "region-text": "Бүх бүс нутаг",
        "search-placeholder": "Сургуулиудыг хайх",
        "search-button": "🔍",
        "price-label": "Төлбөр",
        "course-type-label": "Сургалтын төрөл",
        "long-term": "Урт хугацааны",
        "short-term": "Түр хугацааны",
        "dormitory": "Дотуур байр",
        "scholarship": "Тэтгэлэг",
        "access-button": "Хандалт",
        "no-results": "Сургуулиуд олдсонгүй.",
        "price-fees": "Хэмжээгээр ",
        "Search Criteria": "Хайлтын шалгуур",
        "東京都": "Токио",
        "大阪府": "Осака",
        "福岡県": "Фукуока",
        "京都府": "Киото",
        "北海道": "Хоккайдо",
        "愛知県": "Айчи",
        "茨城県": "Ибараки",
        "埼玉県": "Сайтама",
        "千葉県": "Тиба",
        "兵庫県": "Хёго",
        "新潟県": "Ниигата",
        "福島県": "Фүкүшима",
        "栃木県": "Точиги",
        "群馬県": "Гумма",
        "神奈川県": "Канагава",
        "長野県": "Нагано",
        "富山県": "Тояма",
        "石川県": "Ишикава",
        "岐阜県": "Гифү",
        "静岡県": "Шизүока",
        "奈良県": "Нара",
        "和歌山県": "Вакаяма",
        "鳥取県": "Тоттори",
        "島根県": "Шимане",
        "岡山県": "Окаяма",
        "広島県": "Хиросима",
        "山口県": "Ямагүчи",
        "愛媛県": "Эхиме",
        "熊本県": "Кумамото",
        "沖縄県": "Окинава",
        "宮城県": "Мияги",
        "img1": "Хамтдаа Япон хэл сураарай!",
        "img2": "Зугаатайгаар Япон хэл сураарай!",
        "img3": "Хамтдаа Япон хэл сурах болно!",
        "img4": "Япон хэлийг сураад, өөрийн ертөнцийг өргөжүүлээрэй!",
        "prev": "Өмнөх",
        "next": "Дараах",
        "アクセス": "Хандалт"
    },
    cn: {
        "logo": "日本学校搜索",
        "lang-ja": "日本語",
        "lang-en": "english",
        "lang-mn": "mongolia",
        "region-label": "地区",
        "region-text": "所有地区",
        "search-placeholder": "搜索学校",
        "search-button": "🔍",
        "price-label": "学费",
        "course-type-label": "课程类型",
        "long-term": "长期",
        "short-term": "短期",
        "dormitory": "宿舍",
        "scholarship": "奖学金",
        "access-button": "访问",
        "no-results": "未找到学校。",
        "price-fees": "最多 ",
        "Search Criteria": "搜索条件",
        "東京都": "东京",
        "大阪府": "大阪",
        "福岡県": "福冈",
        "京都府": "京都",
        "北海道": "北海道",
        "愛知県": "爱知",
        "茨城県": "茨城",
        "埼玉県": "埼玉",
        "千葉県": "千叶",
        "兵庫県": "兵库",
        "新潟県": "新潟",
        "福島県": "福岛",
        "栃木県": "栃木",
        "群馬県": "群马",
        "神奈川県": "神奈川",
        "長野県": "长野",
        "富山県": "富山",
        "石川県": "石川",
        "岐阜県": "岐阜",
        "静岡県": "静冈",
        "奈良県": "奈良",
        "和歌山県": "和歌山",
        "鳥取県": "鸟取",
        "島根県": "岛根",
        "岡山県": "冈山",
        "広島県": "广岛",
        "山口県": "山口",
        "愛媛県": "爱媛",
        "熊本県": "熊本",
        "沖縄県": "冲绳",
        "宮城県": "宫城",
        "img1": "一起学习日语吧！",
        "img2": "快乐学习日语！",
        "img3": "一起学习日语吧！",
        "img4": "学习日语，拓展你的视野！",
        "prev": "上一页",
        "next": "下一页",
        "アクセス": "访问"
    }
    
};

document.querySelector('.language-select').addEventListener('change', function () {
    const selectedLang = this.value; // Get selected language code

    // Loop through all elements that have a 'data-lang' attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang'); // Get the translation key

        // If no translation is available for this key or language, skip
        if (!translations[selectedLang] || !translations[selectedLang][key]) return;

        // Check the tag name and apply translation based on element type
        if (element.tagName === 'INPUT' && element.type === 'checkbox') {
            // If it's a checkbox, update the label text
            const label = element.closest('label'); // Get the closest label element
            if (label) label.textContent = translations[selectedLang][key];
        } else if (element.tagName === 'OPTION') {
            // For <option> elements, update the text content
            element.textContent = translations[selectedLang][key];
        } else if (element.tagName === 'INPUT' && element.type === 'text') {
            // For text input elements, update the placeholder
            element.setAttribute("placeholder", translations[selectedLang][key]);
        } else {
            // For all other elements, just update the text content
            element.textContent = translations[selectedLang][key];
        }
    });
});



// Carousel functionality (if any)
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("carousel");
    const prevButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");
    const dots = document.querySelectorAll(".dot");
    const slides = document.querySelectorAll(".carousel-slide");

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    prevButton.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto Slide (5 seconds)
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }, 5000);
});


// Initialize by fetching data for the first page
fetchData(currentPage);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchButton").addEventListener("click", function () {
        let query = document.getElementById("searchBox").value.trim();

        if (!query) {
            alert("検索キーワードを入力してください！"); // Alert for empty search
            return;
        }

        fetch(`/search?search=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                let resultContainer = document.getElementById("schoolList");
                resultContainer.innerHTML = ""; // Clear previous results

                if (data.error) {
                    alert(data.error);
                    return;
                } else if (data.message) {
                    resultContainer.innerHTML = `<p style="color:red;">該当する学校が見つかりませんでした。</p>`;
                    return;
                }

                // Loop through results and dynamically add to page
                data.forEach(school => {
                    let schoolElement = document.createElement("div");
                    schoolElement.classList.add("school-card");
                    schoolElement.innerHTML = `
                        <div class="school-image">
                            <img src="${school.image}" alt="${school.name}">
                        </div>
                        <div class="school-content" >
                            <h3>${school.name}</h3>
                            <div class="rating">
                                <span>⭐</span>
                                <span>${school.rating}</span>
                            </div>
                            <div class="school-details">
                                <div class="detail-item" ><span>📍</span><span>${school.location}</span></div>
                                <div class="detail-item"><span>💴</span><span>${school.tuition}</span></div>
                                <div class="detail-item"><span>📅</span><span>${school.duration}</span></div>
                                <div class="detail-item"><span>📚</span><span>${school.course_types}</span></div>
                            </div>
                            <p class="school-description"><span>〒</span>${school.features}</p>
                            <button class="button" onclick="window.open('${school.website}', '_blank')" data-lang="アクセス">アクセス</button>
                        </div>
                    `;
                    resultContainer.appendChild(schoolElement);
                });
            })
            .catch(error => console.error("Error:", error));
    });
});
