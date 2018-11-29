import { createStore } from 'redux'

var myFuckingStore = createStore(()=>{
  return {
      // List of chapters store after api call
      chapters: [
        {
          api_id: null || Object,
          id: null,
          slug: "chapter-1",
          name: "Solal",
          content: "Solal content"  
        }
      ],
    
      // List of all infos
      infos: [
        {
          api_id: null || Object,
          id: null,
          name: "Solal",
          type: "flux",
          content: "Solal content"
        }
      ],
    
      // List of steps api call 
      steps:  [
        {
          api_id: null || Object,
          id: null,
          name: "Solal",
          content: "Solal content"
        }
      ]
    }
  }
)

var store = {

  // List of chapters store after api call
  chapters: [
    {
      api_id: null || Object,
      id: null,
      slug: "chapter-1",
      name: "Solal",
      content: "Solal content"  
    }
  ],

  // List of all infos
  infos: [
    {
      api_id: null || Object,
      id: null,
      name: "Solal",
      type: "flux",
      content: "Solal content"
    }
  ],

  // List of steps api call 
  steps:  [
    {
      api_id: null || Object,
      id: null,
      name: "Solal",
      content: "Solal content"
    }
  ]
}

