# diary notes

## day 1
- there is no official Docker image, copy from https://pocketbase.io/docs/going-to-production#using-docker

- after start root page is not the admin :)

2023/08/13 01:38:12 Server started at http://0.0.0.0:8080
experiment1-send-data-for-connected-players-pocketbase-1  | ├─ REST API: http://0.0.0.0:8080/api/
experiment1-send-data-for-connected-players-pocketbase-1  | └─ Admin UI: http://0.0.0.0:8080/_/

- create events collection
http://localhost:8080/_/?#/collections?collectionId=mno705uo3ln4a8t&filter=&sort=-created

- install javascript client 
https://github.com/pocketbase/js-sdk
npm install pocketbase

- expose `events` collection as public 
![events-collection-api-rules.png](events-collection-api-rules.png)


- save event when navigating 

# day 2 

- create user and login page 
- show status from each user
