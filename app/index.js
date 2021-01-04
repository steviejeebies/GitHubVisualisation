drawHistogram({a:"b"})

drawPieChart({a:"b"})

// https://github.com/search -- test your results against this\

const header = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization" : `Token ${AUTHTOKEN}`
}

// cloak-preview header, required for search/commits
const header_clpr = {
    "Accept": "application/vnd.github.cloak-preview+json, application/vnd.github.v3+json",
    "Authorization" : `Token ${AUTHTOKEN}`
}

const url = "https://api.github.com/"
const divTest = document.getElementById("divTest")

document.getElementById("getRepos").addEventListener('click', getRepos);

async function getPrivateRepos() {
    const responce = await fetch(url.concat("search/repositories?q=user:steviejeebies"), {"method" : "GET", "headers": header})
    const result = await responce.json()
    
    // get the full_name value of each element in the result, print it to console
    //result.items.forEach(i=>console.log(i.full_name))

    result.items.forEach(i => {
        const pElement = document.createElement("p");
        pElement.textContent = i.name;
        divTest.appendChild(pElement)
    })
}

getPrivateRepos()

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

async function paginationAllOneArray (passURL, headerMethodObject) {
    let nextURL = passURL
    let returnArray = []

    do {
        let responce = await fetch(nextURL, headerMethodObject)
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
        urlElement = urls.find(item => {
            return item.title === ' rel="next"'
         })
        if(urlElement) nextURL = urlElement.url
    } while(urlElement)
    return returnArray
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