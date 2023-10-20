```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user-->>browser: creates a new note on the page by writing something in to the text field
    user-->>browser: clicks the save button
    browser-->>server: adds new note to list, rerenders the page, then POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    deactivate server
```

<!-- Create a diagram depicting the situation where the user goes to the single-page app version of the notes app at https://studies.cs.helsinki.fi/exampleapp/spa.
 -->
