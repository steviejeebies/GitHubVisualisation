drawHistogram({a:"b"})

drawPieChart({a:"b"})

// https://github.com/search -- test your results against this\

const header = {
    "Accept": "application/vnd.github.v3+json"
}

// cloak-preview header, required for search/commits
const header_clpr = {
    "Accept": "application/vnd.github.cloak-preview+json, application/vnd.github.v3+json"
}

const url = "https://api.github.com/"
const divTest = document.getElementById("divTest")

document.getElementById("getRepos").addEventListener('click', getRepos);

async function getRepos() {
    const responce = await fetch(url.concat("search/repositories?q=stars:>100000"))
    const result = await responce.json()
    
    // get the full_name value of each element in the result, print it to console
    //result.items.forEach(i=>console.log(i.full_name))

    result.items.forEach(i => {
        const pElement = document.createElement("p");
        pElement.textContent = i.full_name;
        divTest.appendChild(pElement)
    })
}

document.getElementById("getIssues").addEventListener('click', getIssues);

async function getIssues() {
    const authorTest = "torvalds"
    const responce = await fetch(url.concat(`search/issues?q=author:${authorTest}`))
    const result = await responce.json()
    
    var obj = []
    result.items.forEach(i => {
        obj.push(i.state)
    })
}

document.getElementById("getCommits").addEventListener('click', getCommits);

async function getCommits() {
    const authorTest = "torvalds"
    const passURL = url.concat(`search/commits?q=a repo:freecodecamp/freecodecamp author-date:2020-01-01..2020-12-31`)

    pagination (passURL, {"headers": header_clpr, "method": "GET"})
}

async function pagination (passURL, headerMethodObject) {
    let urls = [{title:' rel="next"', url: passURL}]
    let returnArray = []

    while (urls[0].title === ' rel="next"') {
        let responce = await fetch(urls[0].url, headerMethodObject)
        let result = await responce.json()
        if(result.items === undefined) break;
        returnArray.push(...result.items)
        let link = responce.headers.get("link")
        let links = link.split(",")
        urls = links.map(a=> {
            return {
                url: a.split(";")[0].replace(">","").replace("<",""),
                title:a.split(";")[1]
            }
        })
        console.log("wahoo")
    }
    console.log(returnArray)
}

function preventDefault(event) { 
    event.preventDefault(); 
    var message = document.getElementById("commentTextareaId").value;
      // (Browsers that enforce the "required" attribute on the textarea won't see this alert)
      if (!message) {
        alert("Please fill out the comment form first.");
        return;
      }
  
      var call = "https://api.github.com/users/steviejeebies"
      d3v4.json(call, function (error,data) {
          console.log(data)
          drawBarChart(data);
       });
} 

document.getElementById("getthingy").addEventListener('submit', preventDefault);