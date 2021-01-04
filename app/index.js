drawHistogram({a:"b"})

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

async function usernameInput(event) {
    // dont want to refresh page
    event.preventDefault(); 
    d3v4.selectAll("svg").remove();     // for clearing all the currently on-screen graphs

    var username = document.getElementById("usernameInput").value;
    
    // (Browsers that enforce the "required" attribute on the textarea won't see this alert)
    if (!username) {
      alert("Please fill out the comment form first.");
      return;
    }

    // first we want to get the JSON for a particular repo
    const responce = await fetch(url.concat(`search/repositories?q=user:${username}`), {"method" : "GET", "headers": header})
    const result = await responce.json()
    
    // so now we're making an array for every type of pie chart there is for this call, with an equivalent
    // radio button for it in the HTML

    user_repos_by_index = []        // all of the values for this will just be 1, so that the pie chart starts out with each slice equal
    user_repos_by_size = []

    result.items.forEach(i => {
        user_repos_by_index.push({label: i.name, value: 1})
        user_repos_by_size.push({label: i.name, value: i.size})
    })

    drawPieChart(user_repos_by_index)
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

document.getElementById("button").addEventListener('click', usernameInput);