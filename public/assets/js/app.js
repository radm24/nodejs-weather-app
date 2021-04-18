const weatherForm = document.querySelector('#weatherForm');
const weatherInput = document.querySelector('#weatherInput');
const errorInfo = document.querySelector('#errorInfo');
const locationInfo = document.querySelector('#locationInfo');
const forecastInfo = document.querySelector('#forecastInfo');
const loadingEl = document.querySelector('#loading');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    hideArrElements([errorInfo, locationInfo, forecastInfo]);

    const location = weatherInput.value;
    if (location) {
        loadingEl.classList.remove('hidden');
        
        fetch(`/weather?address=${location}`).then(response => {
            response.json().then(data => {
                loadingEl.classList.add('hidden');
                if (data.error) {
                    showAndSetTextArrElements([errorInfo], [data.error]);
                } else {
                    showAndSetTextArrElements([locationInfo, forecastInfo], [data.location, data.forecast]);
                }
            })
        })
    }
})

const hideArrElements = (arr) => {
    arr.forEach(el => {
        if (!el.classList.contains('hidden')) {
            el.classList.add('hidden');
        }
    })
}

const showAndSetTextArrElements = (elArr, textArr, isSameText = 0) => {
    // if isSameText has falsy value then elArr and text arrays must contain the same number of elements
    if ((!isSameText && (elArr.length !== textArr.length)) || (!Array.isArray(elArr) || !Array.isArray(textArr))) {
        console.log('Please, provide correct values for elArr and textArr parameters');
        return;
    }

    for (let i = 0; i < elArr.length; i++) {
        elArr[i].textContent = isSameText ? textArr[0] : textArr[i];
        if (elArr[i].classList.contains('hidden')) {
            elArr[i].classList.remove('hidden');
        }
    }
}