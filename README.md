A React + Redux Toolkit application to browse Star Wars characters, view details in a modal, and manage favorites. Features include authentication, session persistence, and protected routes.

    -> Features
 - Browse Star Wars characters fetched from SWAPI
 - View character details in a modal with image, height, mass, birth year, films, and more.
 - Add characters to favorites (stored in session and synced with user account).
 - Login/logout functionality with mock authentication API.
 - Skeleton loaders for smoother user experience while fetching data.
 - Automatic modal URL routing (/people/:id) to support deep linking.
 - Refresh token handling with automatic re-authentication.

     -> Installation
 - Clone or download the archive
 - npm install or yarn install
 - npm run dev

     -> Folder structure
   src/
  ├── components/
  │   ├── atoms/             # Buttons, CloseButton, Backdrop, etc.
  │   ├── molecules/         # PersonCard, Header, Pagination
  │   ├── organisms/         # CharacterDetailsModal, PeopleList
  │   └── pages/             # PeoplePage, FavouritesPage
  ├── services/              # Redux slices, RTK Query APIs, auth, image cache
  ├── types/                 # TypeScript types
  ├── App.tsx
  └── index.tsx

  -> To login, use 
    - adrian@starwars.com / jedi -> has 2 favourite characters
    - adrian2@starwars.com / jedi -> has no favourite characters
