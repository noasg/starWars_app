A React + Redux Toolkit application to browse Star Wars characters, view details in a modal, and manage favorites. Features include authentication, session persistence, and protected routes.

    -> Features
    <br/><br/>
 - Browse Star Wars characters fetched from SWAPI<br/>
 - View character details in a modal with image, height, mass, birth year, films, and more.<br/>
 - Add characters to favorites (stored in session and synced with user account).<br/>
 - Login/logout functionality with mock authentication API.<br/>
 - Skeleton loaders for smoother user experience while fetching data.<br/>
 - Automatic modal URL routing (/people/:id) to support deep linking.<br/>
 - Refresh token handling with automatic re-authentication.<br/><br/>

     -> Installation<br/><br/>
 - Clone or download the archive
 - npm install 
 - npm run dev<br/><br/>

     -> Folder structure<br/><br/>
   src/<br/>
  ├── components/<br/>
  │   ├── atoms/             # Buttons, CloseButton, Backdrop, etc.<br/>
  │   ├── molecules/         # PersonCard, Header, Pagination<br/>
  │   ├── organisms/         # CharacterDetailsModal, PeopleList<br/>
  │   └── pages/             # PeoplePage, FavouritesPage<br/>
  ├── services/              # Redux slices, RTK Query APIs, auth, image cache<br/>
  ├── types/                 # TypeScript types<br/>
  ├── App.tsx<br/>
  └── index.tsx

  -> To login, use <br/><br/>
    - adrian@starwars.com / jedi -> has 2 favourite characters<br/>
    - adrian2@starwars.com / jedi -> has no favourite characters
