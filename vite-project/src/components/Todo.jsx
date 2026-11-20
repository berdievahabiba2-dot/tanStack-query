
import { useState } from "react";

import {useQuery,useMutation,useQueryClient,} from "@tanstack/react-query";

import {getTodos,addTodo,editTodo,deleteTodo,} from "../api/todoApi";

function Todo() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos", search, pageNumber, pageSize],
    queryFn: () =>
      getTodos({
        query: search,
        PageNumber: pageNumber,
        PageSize: pageSize,
      }),
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });

      setName("");
      setDescription("");
      setImages([]);
      document.getElementById("images").value = "";
    },

    onError: (error) => {
      alert(error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors)
        : error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: editTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
      setName("");
      setDescription("");
      setEditId(null);
    },
    onError: (error) => {
      alert(error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors)
        : error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Name ва Description-ро пур кун!");
      return;
    }

    if (editId !== null) {
      editMutation.mutate({
        id: editId,
        name,
        description,
      });
      return;
    }
    if (images.length === 0) {
      alert("Лутфан тасвир интихоб кун!");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    Array.from(images).forEach((image) => {
      formData.append("Images", image);
    });

    addMutation.mutate(formData);
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setName(todo.name);
    setDescription(todo.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setDescription("");
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>Error: {error.message}</h2>;
  return (
    <div className="container">
      <h1>TanStack Query - ToDo CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        <input id="images" type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)}/>
        <button type="submit">{editId !== null ? "Update Todo" : "Add Todo"}</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </form>
      <input type="text" placeholder="Search todos..." value={search} onChange={(e) => {
          setSearch(e.target.value);
          setPageNumber(1);
        }}/>
      <div className="todos">
        {todos.map((todo) => (
          <div className="todo-card" key={todo.id}>
            <h2>{todo.name}</h2>
            <p>{todo.description}</p>
            <p>Status: {todo.isCompleted ? "Completed" : "Not completed"}</p>
            {todo.images?.map((img) => (
              <img key={img.id} src={`https://to-dos-api.softclub.tj/images/${img.imageName}`} alt={todo.name} width="120"/>
            ))}
            <div className="actions">
              <button onClick={() => handleEdit(todo)}>Edit</button>
              <button onClick={() => {if (window.confirm("Delete this Todo?")) {deleteMutation.mutate(todo.id);}}}disabled={deleteMutation.isPending}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button disabled={pageNumber === 1} onClick={() => setPageNumber((prev) => prev - 1)}>Previous</button>
        <span>Page {pageNumber}</span>
        <button disabled={todos.length < pageSize} onClick={() => setPageNumber((prev) => prev + 1)}>Next</button>
      </div>
      {(addMutation.isPending || editMutation.isPending) && (
        <p>Saving...</p>
      )}
    </div>
  );
}
export default Todo;