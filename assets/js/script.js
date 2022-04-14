// gets elements we will need later
const mainEl = document.querySelector("main");
const mainSectionEl = document.querySelector("main section");
const nameInputEl = document.getElementById("name");
const tagInputEl = document.getElementById("tag");

// global variable for our results from the fetch request
var studentResults = [];

// fetch request to get our list of students
const getStudents = () => {
    fetch("https://api.hatchways.io/assessment/students", { headers: { method: "GET" } })
        .then(response => {
            // if we get a good response then we render the info to the screen
            if (response.status == 200) {
                response.json()
                    .then(data => {
                        // appends a tags array to our objects
                        for (let i = 0; i < data.students.length; i++) {
                            data.students[i].tags = [];
                        }

                        // save this to our global variable and then renders the info
                        studentResults = data.students;
                        renderStudents(studentResults);
                    })
            // error handling
            } else {
                console.log(response.responseText);
            }
        }).catch(err => {
            console.log(err);
        })
}

// function to draw our html for each student
const renderStudents = studentData => {

    // clears the content of the page before drawing new elements onto it
    mainSectionEl.textContent = "";
    
    // goes through each student and creates their html
    for (let i = 0; i < studentData.length; i++) {

        // we create one element then use a template literal to append it to our section element
        let studentEl = document.createElement("article");

        // template literal calling various functions to get additional html
        studentEl.innerHTML = `
        <div class="article-content">
            <img src=${studentData[i].pic}>
            <div class="article-text">
                <h2>${studentData[i].firstName + " " + studentData[i].lastName}</h2>
                <div class="paragraph-text">
                    <p>Email: ${studentData[i].email}</p>
                    <p>Company: ${studentData[i].company}</p>
                    <p>Skill: ${studentData[i].skill}</p>
                    <p>Average: ${getAverageGrades(studentData[i].grades)}%</p>
                    <div class="popout" id="popout-${i}" data-state="closed">${getTestList(studentData[i].grades)}</div>
                    <div>${renderTagSpans(studentData[i].tags)}</div>
                    <form onsubmit="handleTagSubmit(event)">
                        <input name="tag-${i}" class="input"></input>
                    </form>
                </div>
            </div>
        </div>
        <button data-element="${i}"><i class="bi bi-plus-lg"></i></button>
        `

        // append element
        mainSectionEl.appendChild(studentEl);
    }
}

// get the average of the grades to be returned to the "grades" <p>
const getAverageGrades = grades => {

    // simple average function
    var total = 0
    for (let i = 0; i < grades.length; i++) {
        total += parseInt(grades[i]);
    }
    return total/grades.length;
}

// creates the html for the list of tests
const getTestList = tests => {
    var testsOutput = "";

    // uses a template literal on each test to create its own <p>
    for (let i = 0; i < tests.length; i++) {
        testsOutput += `<p>Test ${i + 1}: ${tests[i]}%</p>`;
    }
    return testsOutput;
}

// same as the test list except for our list of "span" element created from saved tags
const renderTagSpans = tags => {
    var tagsOutput = "";
    for (let i = 0; i < tags.length; i++) {
        tagsOutput += `<span>${tags[i]}</span>`;
    }
    return tagsOutput;
}

// handle any click on the main element or events that bubbled up
const handleMainClick = event => {

    // only runs when the event is on and icon
    if (event.target.matches("i")) {

        // get the button of the target element
        var buttonEl = event.target.parentElement;

        // get the associated popout element
        var popoutEl = document.querySelector("#popout-" + buttonEl.getAttribute("data-element"));

        // if the popout is closed we open it and change the icon to a minus
        if (popoutEl.getAttribute("data-state") == "closed") {
            popoutEl.style.maxHeight = '225px';
            buttonEl.innerHTML = '<i class="bi bi-dash-lg"></i>';
            popoutEl.setAttribute("data-state", "open");

        // if the popout is open we close it and change the icon to a plus
        } else {
            popoutEl.style.maxHeight = '0';
            buttonEl.innerHTML = '<i class="bi bi-plus-lg"></i>'
            popoutEl.setAttribute("data-state", "closed");
        }
    }
}

// when you press enter and submit a tag this runs
const handleTagSubmit = event => {

    // stops the page from reloading
    event.preventDefault();

    // get the first child of the form so we can get the value from it
    var tagEl = event.target.children[0];

    // get the array index of the input from its "name" attr
    // then pushes the new tag to the corrisponding array
    studentResults[tagEl.name.split("-")[1]].tags.push(tagEl.value);
    
    // clears out the form
    tagEl.value = "";

    // draws the new data including the tags
    renderStudents(studentResults);
}

// filters students based on search terms
const filterResults = () => {

    // gets what is in the search bars currently
    let inputText = nameInputEl.value.toLowerCase();
    let tagText = tagInputEl.value.toLowerCase();

    // use the array method "filter" to get our result
    const searchResults = studentResults.filter(student => {

        // open the filter into function and get our setup variables
        let studentName = student.firstName + " " + student.lastName;
        let studentTag = student.tags.join('');

        // if the student name contains the search term & the tags contain the tag search term then return true
        if (studentName.toLowerCase().includes(inputText) && studentTag.toLowerCase().includes(tagText)) {
            return true;

        // if not, return false
        } else {
            return false;
        }
    })

    // render again with these results as the input
    renderStudents(searchResults);
}

// runs our fetch onload
getStudents();

// add event listeners that we need for the buttons and search bar
mainEl.addEventListener("click", handleMainClick);
nameInputEl.addEventListener("input", filterResults);
tagInputEl.addEventListener("input", filterResults);