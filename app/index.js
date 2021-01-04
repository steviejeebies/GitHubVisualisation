drawHistogram({a:"b"})

drawPieChart()

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

function usernameInput(event) {
    // dont want to refresh page
    event.preventDefault(); 
    
    // (Browsers that enforce the "required" attribute on the textarea won't see this alert)
    if (!message) {
      alert("Please fill out the comment form first.");
      return;
    }
    
    var username = document.getElementById("usernameInput").value;

    // first we want to get the JSON for a particular repo
    const responce = await fetch(url.concat(`search/repositories?q=user:${username}`), {"method" : "GET", "headers": header})
    const result = await responce.json()
    
    // so now we're making an array for every type of pie chart there is for this call, with an equivalent
    // radio button for it in the HTML

    user_repos_by_size = []
    user_repos_by_score = []

    result.items.forEach(i => {
        user_repos_by_size.push({label: i.full_name, value: i.size})
        user_repos_by_score.push({label: i.full_name, value: i.score})
    })

    drawPieChart()
}

// WILL BORROW FROM THE BELOW COMMENTED FUNCTIONS AS NEEDED

// const divTest = document.getElementById("divTest")

// document.getElementById("getRepos").addEventListener('click', getRepos);

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

// getPrivateRepos()

// async function getRepos() {
//     const responce = await fetch(url.concat("search/repositories?q=stars:>100000"))
//     const result = await responce.json()
    
//     // get the full_name value of each element in the result, print it to console
//     //result.items.forEach(i=>console.log(i.full_name))

//     result.items.forEach(i => {
//         const pElement = document.createElement("p");
//         pElement.textContent = i.full_name;
//         divTest.appendChild(pElement)
//     })
// }

// document.getElementById("getIssues").addEventListener('click', getIssues);

// async function getIssues() {
//     const authorTest = "torvalds"
//     const responce = await fetch(url.concat(`search/issues?q=author:${authorTest}`))
//     const result = await responce.json()
    
//     var obj = []
//     result.items.forEach(i => {
//         obj.push(i.state)
//     })
// }

// document.getElementById("getCommits").addEventListener('click', getCommits);

// async function paginationAllOneArray (passURL, headerMethodObject) {
//     let nextURL = passURL
//     let returnArray = []

//     do {
//         let responce = await fetch(nextURL, headerMethodObject)
//         let result = await responce.json()
//         if(result.items === undefined) break;
//         returnArray.push(...result.items)
//         let link = responce.headers.get("link")
//         let links = link.split(",")
//         urls = links.map(a=> {
//             return {
//                 url: a.split(";")[0].replace(">","").replace("<",""),
//                 title:a.split(";")[1]
//             }
//         })
//         urlElement = urls.find(item => {
//             return item.title === ' rel="next"'
//          })
//         if(urlElement) nextURL = urlElement.url
//     } while(urlElement)
//     return returnArray
// }



function preventDefault(event) { 
    
} 

document.getElementById("usernameInput").addEventListener('submit', usernameInput);