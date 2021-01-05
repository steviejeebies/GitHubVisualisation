drawHistogram({ a: "b" })

// https://github.com/search -- test your results against this\
var outResult
var repoNumCommits
let mLParameter

const header = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `Token ${AUTHTOKEN}`
}

// cloak-preview header, required for search/commits
const header_commit = {
    "Accept": "application/vnd.github.cloak-preview+json, application/vnd.github.v3+json",
    "Authorization": `Token ${AUTHTOKEN}`
}

const url = "https://api.github.com/"

function getDateBeforeAfter(string, num) {                     // date has to be in format "2020-03-01"
    let today = new Date(string)
    today.setDate(today.getDate() + num);                     // if num = -1, get num before, if num = 1 get num after
    return today.toISOString().slice(0, 10);
}

async function usernameInput(event) {
    // dont want to refresh page
    event.preventDefault();
    
    document.getElementById("userInfo").style.visibility = "visible";
    document.getElementById("multiline_wait").style.visibility = "visible";
    document.getElementById("piechart_radio_buttons").style.visibility = "hidden";

    d3v4.selectAll("svg").remove();     // for clearing all the currently on-screen graphs

    let username = document.getElementById("usernameInput").value;

    // (Browsers that enforce the "required" attribute on the textarea won't see this alert)
    if (!username) {
        alert("Please fill out the comment form first.");
        return;
    }

    // first we want to get the JSON for a particular repo
    let result = await paginationAllOneArray(url.concat(`search/repositories?q=user:${username}`), { "method": "GET", "headers": header })

    // so now we're making an array for every type of pie chart there is for this call, with an equivalent
    // radio button for it in the HTML

    user_repos_by_index = []        // all of the values for this will just be 1, so that the pie chart starts out with each slice equal
    user_repos_by_size = []

    result.forEach(i => {
        user_repos_by_index.push({ label: i.name, value: 1 })
        user_repos_by_size.push({ label: i.name, value: i.size })
    })
    document.getElementById("piechart_radio_buttons").style.visibility = "visible";
    drawPieChart(user_repos_by_index)

    // Now we want to get all the commits made by the user (accross all repos they've committed to, not
    // just their own). I'm only interested in commits made in the last year

    let today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    let lastYear = today.toISOString().slice(0, 10);

    let callURL = `search/commits?q=author:${username} author-date:>${lastYear}`

    result = await paginationAllOneArray(url.concat(callURL), { "method": "GET", "headers": header_commit })

    console.log(result);

    // Now that we have all the commits, I want to nest them according to repository. This can easily be done 
    // with a D3 function

    var nestedReposFull = d3v3.nest()
        .key(function (d) { return d.repository.full_name; })
        .entries(result);

    // The issue is that we have to count the total of commits for each day, and there doesn't seem to 
    // be a clean way to do this other than a for-loop, again relying on D3's nesting function. Once 
    // we have the nesting done, we can create elements to pass to multiLineGraph.js by constructing an 
    // object of the form {count: Number, month: DateString, name:RepoNameString}
    repoNumCommits = []

    for (let i = 0; i < nestedReposFull.length; i++) {
        repoNumCommits.push(d3v3.nest()
            .key(function (d) { return d.commit.author.date.substring(0, 10); })
            .entries(nestedReposFull[i].values))
    }

    mLParameter = []
    repoNumCommits.forEach(s => {
        let repoName = s[0].values[0].repository.full_name;
        mLParameter.push({ count: 0, month: getDateBeforeAfter(s[0].key, -1), name: repoName })
        s.forEach(t => {
            mLParameter.push({ count: t.values.length, month: t.key, name: t.values[0].repository.full_name })
        })
        mLParameter.push({ count: 0, month: getDateBeforeAfter(s[s.length - 1].key, +1), name: repoName })
    })

    // Now we have the exact structure we need for the multiLineGraph

    drawMultiLineGraph(mLParameter, "Commits");

    document.getElementById("multiline_wait").style.visibility = "hidden";

    // Now we want to draw the force directed graphs for following.
    // We get the users that a user is following. Create an elements
    // target: userFollowed source: thisUser for each one. Then for each user we found,
    // we find who they are following, and do the same. This is done 3 times only, 
    // because the graph could become massive otherwise. 

    let fdgParameter = []
    callURL = `users/${username}/following`

    result = paginationAllOneArray(url.concat(callURL), { "method": "GET", "headers": header })
    let usersFollowedURLs = []
    result.forEach(i => {
        fdgParameter.push({source: username, target: i.login, value: 1})
        usersFollowedURLs.push(url.concat(`users/${i.login}/following`))
    })
    



    // nestedReposFull.items.forEach(i => {
    //     repoNumCommits.push(d3v3.nest()
    //                             .key(function(d) { return d.values.commit.date.substring(0, 9); })
    //                             .entries(outResult))
    // })

    // let commitInfoForMultiLine = []
    // result.forEach(    
    //     result.items.forEach(i => {
    //         obj.push({})
    //     }))

    // console.log(result);
    // get the full_name value of each element in the result, print it to console
    //result.items.forEach(i=>console.log(i.full_name))
}

// WILL BORROW FROM THE BELOW COMMENTED FUNCTIONS AS NEEDED

// const divTest = document.getElementById("divTest")

// document.getElementById("getRepos").addEventListener('click', getRepos);

async function getPrivateRepos() {
    const responce = await fetch(url.concat("search/repositories?q=  user:steviejeebies"), { "method": "GET", "headers": header })
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

// var obj = []
// result.items.forEach(i => {
//     obj.push(i.state)
// })
// }

// document.getElementById("getCommits").addEventListener('click', getCommits);

async function paginationAllOneArray(passURL, headerMethodObject) {
    let resultsPerPage = 150
    let nextURL = passURL.concat("&per_page=" + resultsPerPage)
    let returnArray = [];

    // I will parallelize paged calls to speed them up. The first call can't be parallelized as we 
    // need to use its result to judge how many pages there are. This can be calclated by floor(return.total_count/resultsPerPage)

    let responce = await fetch(nextURL, headerMethodObject)
    let result = await responce.json()
    console.log(result);
    if (result.items === undefined) return results;                          // if only 1 page, we can return this array
    let numResults = (result.total_count > 999 ? 999 : result.total_count)     // limiting, if we're paging for more than 1000 values then this is too much
    let numPages = Math.floor(numResults / result.items.length)       // floor, as we've already gotten the first page
    if (numPages <= 1) return result.items;
    returnArray.push(...result.items)

    let allURLs = []
    for (let i = 2; i <= numPages + 1; i++) {
        allURLs.push(nextURL.concat("&page=" + i))
    }

    let pagedReturn = await getAllUrls(allURLs, headerMethodObject);
    if(pagedReturn != null) pagedReturn.forEach(i => { if(i.items != undefined) returnArray.push(...i.items) })

    //     if (link !== null) {
    //         let links = link.split(",")                                       // This was my old way of getting paginated results,
    //         urls = links.map(a=> {                                            // it just took the url from the 'rel:next=' values and
    //             return {                                                      // made a sequential call
    //                 url: a.split(";")[0].replace(">","").replace("<",""),
    //                 title:a.split(";")[1]
    //             }
    //         })
    //         urlElement = urls.find(item => {
    //             return item.title === ' rel="last"'
    //         })
    //     }
    //     if(urlElement) nextURL = urlElement.url
    // } while(urlElement)
    return returnArray
}

async function getAllUrls(urls, headerMethodObject) {                       // used for Parallelization
    try {
        var data = await Promise.all(
            urls.map(
                url =>
                    fetch(url, headerMethodObject).then(
                        (response) => response.json()
                    )));

        return (data)

    } catch (error) {
       console.log(error)
    }
}

function getRandomColor() {
    Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = "#" + randomColor;
    color.innerHTML = "#" + randomColor;
}

document.getElementById("button").addEventListener('click', usernameInput);