drawHistogram({a:"b"})

drawPieChart({a:"b"})

const url = "https://api.github.com/"
const divTest = document.getElementById("divTest")

async function getRepos() {
    const responce = await fetch(url.concat("search/repositories?q=stars:>100000"))
    const result = await responce.json()
    
    // get the full_name value of each element in the result, print it to console
    //result.items.forEach(i=>console.log(i.full_name))

    result.items.forEach(i =>{
        const pElement = document.createElement("p");
        pElement.textContent = i.full_name;
        divTest.appendChild(pElement)
    })
}

document.getElementById("getRepos").addEventListener('click', getRepos);
document.getElementById("getIssues").addEventListener('click', getIssues);

async function getIssues() {
    const authorTest = "steviejeebies"
    const responce = await fetch(url.concat(`search/repositories?q=author:${authorTest}`))
    const result = await responce.json()
    
    // get the full_name value of each element in the result, print it to console
    //result.items.forEach(i=>console.log(i.full_name))

    result.items.forEach(i =>{
        const pElement = document.createElement("p");
        pElement.textContent = i.full_name;
        divTest.appendChild(pElement)
    })
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
document.getElementById("getthingy").addEventListener('click', preventDefault);