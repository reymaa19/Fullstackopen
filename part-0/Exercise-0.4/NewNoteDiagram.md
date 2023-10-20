```mermaid
sequenceDiagram
    participant browser
    participant server
    participant user

    user-->>browser: creates a new note on the page by writing something in to the text field
    user-->>browser: clicks the save button
    browser-->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    browser-->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: [...,{ "content": "HTML is easy", "date": "2023-1-1" }]
    deactivate server
```

<!-- Create a similar diagram depicting the situation where the user creates a new note on the page https://studies.cs.helsinki.fi/exampleapp/notes by writing something into the text field and clicking the Save button. -->
