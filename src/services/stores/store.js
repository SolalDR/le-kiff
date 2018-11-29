import { createStore, combineReducers } from 'redux';
import entities from './reducers/entities.js';
import ui from './reducers/ui.js';

const stores = combineReducers({
  entities,
  ui
});

export const store = createStore(stores);

// var myFuckingStore = createStore( () => {
//   return {
//       // List of chapters store after api call
//       chapters: [
//         {
//           api_id: null || Object,
//           id: null,
//           slug: "chapter-1",
//           name: "Solal",
//           content: "Solal content"  
//         }
//       ],
    
//       // List of all infos
//       infos: [
//         {
//           api_id: null || Object,
//           id: null,
//           name: "Solal",
//           type: "flux",
//           content: "Solal content"
//         }
//       ],
    
//       // List of steps api call 
//       steps:  [
//         {
//           api_id: null || Object,
//           id: null,
//           name: "Solal",
//           content: "Solal content"
//         }
//       ]
//     }
//   }
// )

// var store = {

//   // List of chapters store after api call
//   chapters: [
//     {
//       api_id: null || Object,
//       id: null,
//       slug: "chapter-1",
//       name: "Solal",
//       content: "Solal content"  
//     }
//   ],

//   // List of all infos
//   infos: [
//     {
//       api_id: null || Object,
//       id: null,
//       name: "Solal",
//       type: "flux",
//       content: "Solal content"
//     }
//   ],

//   // List of steps api call 
//   steps:  [
//     {
//       api_id: null || Object,
//       id: null,
//       name: "Solal",
//       content: "Solal content"
//     }
//   ]



//   chapter: {
//     api_response: null || Object,
//   }

// }

