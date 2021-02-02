const { ApolloClient, InMemoryCache, HttpLink, gql } = require("apollo-boost");
const { createHttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const moment = require("moment");
//const { setContext } = require("@apollo/client/link/context");

let client;
function createApolloClient() {
  const httpLink = createHttpLink({
    uri: "https://api.yelp.com/v3/graphql",
    credentials: "include",
    fetch,
  });

  //   const authLink = setContext((_, { headers }) => {
  //     return {
  //       headers: {
  //         ...headers,
  //         authorization: `Bearer ${process.env.YELP_API_KEY}`,
  //       },
  //     };
  //   });
  //authLink.concat(httpLink),
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

const BUSINESSES_QUERY = gql`
  query Search($term: String, $location: String, $offset: Int) {
    search(term: $term, location: $location, limit: 10, offset: $offset) {
      total
      business {
        id
        name
        photos
        id
        name
        photos
        phone
        rating
        display_phone
        review_count
        location {
          formatted_address
        }
      }
    }
  }
`;

const BUSINESS_QUERY = gql`
  query Business($id: String) {
    business(id: $id) {
      id
      name
      photos
      id
      name
      photos
      phone
      display_phone
      rating
      review_count
      is_closed
      reviews {
        text
        text
        time_created
        rating
        user {
          name
          image_url
        }
      }
      price
      hours {
        open {
          is_overnight
          end
          start
          day
        }
      }
      location {
        formatted_address
      }
    }
  }
`;

const GetBusinesses = (term, location, offset) => {
  if (!client) client = createApolloClient();

  return client.query({
    query: BUSINESSES_QUERY,
    variables: {
      term,
      location,
      offset,
    },
    context: {
      // example of setting the headers with context per operation
      headers: {
        authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    },
  });
};

const formatHour = ({ data }) => {
  const {
    business: { hours },
  } = data;
  const format = (d) => moment(d, "hh").format("LT");
  const actual_date = moment().day();
  const formated_hours = hours[0].open.map((d) => ({
    ...d,
    end: format(d.end),
    start: format(d.start),
    current: d.day === actual_date,
    start_number: d.start,
    end_number: d.end,
  }));
  return { business: { ...data.business, hours: formated_hours } };
};

const GetBusinnes = async (id) => {
  if (!client) client = createApolloClient();

  const data = await client.query({
    query: BUSINESS_QUERY,
    variables: {
      id,
    },
    context: {
      // example of setting the headers with context per operation
      headers: {
        authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    },
  });
  return formatHour(data);
};
module.exports = { GetBusinesses, GetBusinnes };
