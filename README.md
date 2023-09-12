# FuzzyFolio

- Erik Cox
- Shujin Pang
- Anthony Bravo
- Karen Lee

FuzzyFolio - Pawsitive Care, Purrfect Records!

# Design

- [API Endpoints](docs/apis.md)
- [Data Tables](docs/data_tables.md)
- [Webpage Interface/ GHI](docs/web_interface.md)
- [Third Party API](docs/third_api.md)

# Intended Market

Pet owners in the community. Gives them a space to track and plan for their pets with pet profiles and medical/vaccination records. Provides a platform for pet donations in order for pet owners to exchange pet items.

# Functionality

## Visitors:

- Should be able to view the home page with animal facts
- Sign up for an account
- View donation list page
- View member log in page

## Logged in users:

- View everything that a visitor can, plus the following
- View my pets list
- View individual pet's details
- Edit individual pet information
- Delete pet
- View vaccination records under a specific pet's detail page
- Edit specific vaccine record
- Delete specific vaccine record
- Create a donation
- View my donation items details
- Edit my donation items
- Delete my donation item
- View user account details
- Edit user account details
- Delete user account

# Project Initialization

In order to view this application on your local machine, please follow the following steps:

1. Clone the repository from https://gitlab.com/fuzzyfolio/fuzzy-folio/
2. In terminal, cd into the new project directory
3. Run `docker volume create FuzzyFolio`
4. Run `docker-compose build`
5. Run `docker-compose up`
6. Run `localhost:3000` on the browser url field

Then you can fully enjoy our application on your local machine!
