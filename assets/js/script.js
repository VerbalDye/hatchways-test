const mainEl = document.querySelector("main");
const mainSectionEl = document.querySelector("main section");
const nameInputEl = document.getElementById("name");
var studentResults = [];

const getStudents = () => {
    fetch("https://api.hatchways.io/assessment/students", { headers: { method: "GET" } })
        .then(response => {
            if (response.status == 200) {
                response.json()
                    .then(data => {
                        console.log(data.students);
                        studentResults = data.students;
                        renderStudents(studentResults);
                    })
            }
        })
}

const renderStudents = studentData => {
    mainSectionEl.textContent = "";
    
    for (let i = 0; i < studentData.length; i++) {
        let studentEl = document.createElement("article");

        studentEl.innerHTML = `
        <div class="article-content">
            <img src=${studentData[i].pic}>
            <div class="article-text">
                <h2>${studentData[i].firstName + " " + studentData[i].lastName}</h2>
                <p>Email: ${studentData[i].email}</p>
                <p>Company: ${studentData[i].company}</p>
                <p>Skill: ${studentData[i].skill}</p>
                <p>Average: ${getAverageGrades(studentData[i].grades)}%</p>
                <div class="popout" id="popout-${i}" data-state="closed">${getTestList(studentData[i].grades)}</div>
            </div>
        </div>
        <button data-element="${i}"><i class="bi bi-plus-lg"></i></button>
        `
        mainSectionEl.appendChild(studentEl);
    }
}

const getAverageGrades = grades => {
    var total = 0
    for (let i = 0; i < grades.length; i++) {
        total += parseInt(grades[i]);
    }
    return total/grades.length;
}

const getTestList = tests => {
    var testsOutput = ""
    for (let i = 0; i < tests.length; i++) {
        testsOutput += `<p>Test ${i + 1}: ${tests[i]}%</p>`
    }
    return testsOutput
}

const handleMainClick = event => {
    if (event.target.matches("i")) {
        var buttonEl = event.target.parentElement;
        var popoutEl = document.querySelector("#popout-" + buttonEl.getAttribute("data-element"));
        console.log(popoutEl);
        if (popoutEl.getAttribute("data-state") == "closed") {
            popoutEl.style.maxHeight = '225px';
            buttonEl.innerHTML = '<i class="bi bi-dash-lg"></i>';
            popoutEl.setAttribute("data-state", "open");
        } else {
            popoutEl.style.maxHeight = '0';
            buttonEl.innerHTML = '<i class="bi bi-plus-lg"></i>'
            popoutEl.setAttribute("data-state", "closed");
        }
    }
}

const filterResults = () => {
    const inputText = nameInputEl.value.toLowerCase();
    const searchResults = studentResults.filter(student => {
        let studentName = student.firstName + " " + student.lastName;
        if (studentName.toLowerCase().includes(inputText)) {
            return true;
        } else {
            return false;
        }
    })
    renderStudents(searchResults);
}


getStudents();

mainEl.addEventListener("click", handleMainClick);
nameInputEl.addEventListener("input", filterResults);