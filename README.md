Sure! Below is the updated README with the corrected package name:

---

# @cantabile/react-query

@cantabile/react-query is a powerful data fetching and caching library for React applications. It enables seamless integration of server data into your components, with features like automatic caching, background data updates, and efficient invalidation strategies.

## Installation

You can install @cantabile/react-query via npm or yarn:

```bash
npm install @cantabile/react-query
```

or

```bash
yarn add @cantabile/react-query
```

## Getting Started

To start using @cantabile/react-query, import the necessary functions and components into your application:

```javascript
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@cantabile/react-query";
```

Then, create a `QueryClient` instance and wrap your application with `QueryClientProvider`:

```javascript
const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById("root")
);
```

Now you can use the `useQuery` hook to fetch and manage data in your components:

```javascript
function Todos() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["todos"],
    fetchFn: fetchTodos,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## Features

### 1. Data Fetching

@cantabile/react-query provides the `useQuery` hook to fetch data from your server and automatically handle caching, loading states, and error handling.

```javascript
const { isLoading, error, data } = useQuery({
  queryKey: ["todos"],
  fetchFn: fetchTodos,
});
```

### 2. Mutations

You can use mutations to perform data updates on your server and automatically update the cache.

```javascript
const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    queryClient.invalidateQueries("todos");
  },
});
```

### 3. Query Invalidation

@cantabile/react-query offers various strategies for invalidating cached data, including manual invalidation, automatic refetching, and stale-while-revalidate.

```javascript
queryClient.invalidateQueries("todos");
```

### 4. Background Data Updates

@cantabile/react-query can automatically update your cached data in the background at regular intervals.

```javascript
const { isLoading, error, data } = useQuery({
  queryKey: ["todos"],
  fetchFn: fetchTodos,
  refetchInterval: 5000, // Refetch every 5 seconds
});
```

## Documentation

For more detailed documentation and usage examples, please visit the [React Query documentation](https://react-query.tanstack.com/).

## Contributing

We welcome contributions from the community! If you'd like to contribute to @cantabile/react-query, please check out our [contribution guidelines](CONTRIBUTING.md) and feel free to submit pull requests.

## License

@cantabile/react-query is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README further to include additional information or instructions specific to your repository!
