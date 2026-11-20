
import axios from "axios";

const api = axios.create({
  baseURL: "https://to-dos-api.softclub.tj/api",
});

export const getTodos = async (params) => {
  const { data } = await api.get("/to-dos", { params });
  return data.data;
};

export const addTodo = async (newTodo) => {
  const { data } = await api.post("/to-dos", newTodo);
  return data;
};

export const editTodo = async (todo) => {
  const { data } = await api.put("/to-dos", todo);
  return data;
};

export const deleteTodo = async (id) => {
  const { data } = await api.delete("/to-dos", {
    params: { id },
  });
  return data;
};
