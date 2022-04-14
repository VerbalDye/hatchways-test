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
        <img src=${studentData[i].pic}>
        <div>
            <h2>${studentData[i].firstName + " " + studentData[i].lastName}</h2>
            <p>Email: ${studentData[i].email}</p>
            <p>Company: ${studentData[i].company}</p>
            <p>Skill: ${studentData[i].skill}</p>
            <p>Average: ${getAverageGrades(studentData[i].grades)}%</p>
        </div>
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

nameInputEl.addEventListener("input", filterResults)