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

migrate to typescript 
https://react.dev/learn/typescript

This syntax is very good!!

```tsx
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}
```

er... `npm create-react-app --template typescript` generated an application without scripts in package.json 

lets see how to convert
see https://mattermost.com/blog/using-react-with-typescript/

``` 
npm install -D typescript @types/node @types/react @types/react-dom @types/jest
```
add tsconfig.json 

```
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```
see https://react.dev/learn/typescript for more docs 

example https://www.youtube.com/watch?v=gUYBFDPZ5qk
- create user and login page 
https://dev.to/franciscomendes10866/how-to-use-pocketbase-authentication-with-react-context-11be

good job here https://github.com/FranciscoMendes10866/pocketbase-auth-example

passwords length must be at minimum of 8 chars!!!!

![Hurray!! page protected](page-protected.png)


## day 3 

### goal: show status from each user

go back to the admin: http://localhost:8080/_/#/collections?collectionId=_pb_users_auth_&filter=&sort=-created

#### done 
sigin another@foo.com/12345678
- add session entity = userID, counter
- create session 
- leave session
- fix when adding after a reload is adding multiple times, missed unsubscribing 
- show session participants subscribing to the changes

## day 4 

#### done 
PocketProvider.init() is called twice...
https://react.dev/learn/synchronizing-with-effects#not-an-effect-initializing-the-application
<React.StrictMode> works like that in dev mode when refactoring prevent this.
- update is not working properly
another@foo.com/12345678
- increase counter in your own session

## day 5 

### done 
- refactor pocketbase access to be done by a single bear :)
- refactor PocketProvider.tsx to isolate: PocketProvider, AuthProvider and SessionProvider
  - use https://github.com/pmndrs/zustand to avoid multiple providers
  - Archive: use reduceRight composition strategy from here https://matheusplessmann.com/avoid-provider-hell-with-composition/
  - PocketProvider - keep connection to pocketbase and expose pb state
  - AuthProvider - authentication only
  - SessionProvider - user session, rename to GameStateProvider, session has similar context to authentication

### to do 

- add some tests 
- return record with proper data type
  - can we export classes from pocketbase?
  - can we generate a swagger and then generate the models only?

  
