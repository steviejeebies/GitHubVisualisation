# GitHub Visualization Project

This is my submission for the Visualization Project. 

## Token

The only requirement is to add a `token.js` file in the top level directory (ignored by my .gitignore). In this file, add the following:
```
const AUTHTOKEN = "yourPersonalAccessToken"
```

## Docker
For docker, I used the [httpd](https://hub.docker.com/_/httpd) Docker Image, which serves the root HTML file. *However*, the site can also just be run by opening the file `index.html`, nothing else required.

## Graphs
### Repo Info
![alt text](https://i.ibb.co/BND3bPk/Untitled.png)

This graph allows you to view all the repos created by a user, presents them in a Pie Chart, with options to compare based on repo information. I recommend the account *OneLoneCoder* for this graph, as it shows a good example of it in action.

### Following
![alt text](https://i.ibb.co/QfTNnZ4/Untitled.png)

This graph retrieves all of the users the inputted user is following, then continues for each of those users. It is currently set to a depth of 2 (as I found that if it was any higher, it could get very unwieldy). There is only one node per user, so if, for example, the inputted user follows User A and User B, and User A also follows User B, then a connection will be made between User A and B, as opposed to having multiple As and Bs.

### Commits Across All Repos
![alt text](https://i.ibb.co/pdHGnpn/Untitled.png)

For this graph, I wanted to show which all the projects the user has been working on, with respect to time, regardless of if the user created the repo themselves. The graph draws either the last year of commits, or the last 1000 commits (whichever is less). The graph is also zoomable and you can scroll through different time periods.
