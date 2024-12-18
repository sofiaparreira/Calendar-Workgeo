import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteTaskModal from "./components/DeleteTaskModal";
import axios from "axios";
import AddTaskModal from "./components/AddTaskModal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleGetDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${id}`);
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.log("Erro ao buscar detalhes da tarefa: ", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:3000/delete/${task.id}`);
      console.log("Tarefa excluída com sucesso");
      navigate("/");
    } catch (error) {
      console.log("Erro ao excluir a tarefa: ", error);
    }
  };

  const handleTaskCompletion = async () => {
    try {
      const updatedTask = { ...task, isDone: true };
      await axios.put(`http://localhost:3000/update/${task.id}`, updatedTask);
      setTask(updatedTask);
      console.log("Tarefa marcada como finalizada com sucesso");
      console.log(task.isDone);
    } catch (error) {
      console.log("Erro ao marcar a tarefa como finalizada: ", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleEditTask = () => {
    setEditModal(true);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTask(updatedTask);
    setEditModal(false);
  };

  useEffect(() => {
    handleGetDetail();
  }, [id]);

  useEffect(() => {
    if (editModal === false) {
      handleGetDetail();
    }
  }, [editModal]);

  if (!task) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <button
          onClick={handleBack}
          className="m-4 px-4 py-0.5 space-x-2 rounded border border-gray-200 hover:ring hover:ring-gray-200 duration-300"
        >
          <i className="bi bi-arrow-left-circle-fill"></i>
          <span>Voltar</span>
        </button>
      </div>

      <div className="flex-grow my-16 mx-48">
        <div className="flex justify-between items-center">
          <div className="flex gap-16 items-center">
            <h2 className="text-2xl font-semibold first-letter:uppercase">
              {task.title}
            </h2>
            <span className="text-green-600 bg-green-50 px-8 rounded-md py-1">
              {task.status}
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <button
              onClick={handleEditTask}
              className="bg-orange-400 text-white px-6 py-1.5 rounded-md space-x-3"
            >
              <i className="bi bi-pencil-square"></i>
              <span>Editar</span>
            </button>
            <button
              onClick={handleDeleteModal}
              className="bg-red-500 text-white px-6 py-1.5 rounded-md space-x-3"
            >
              <i className="bi bi-trash3-fill"></i>
              <span>Excluir</span>
            </button>
          </div>
        </div>
        <span className="text-sm text-gray-400">{task.date}</span>

        <div className="mt-16">
          <p className="text-gray-700">Funcionários: </p>
          <div className="flex mt-2">
            <span className="bg-blue-500 text-white text-xs p-3 uppercase font-semibold rounded-full">
              {task.employee.substring(0, 2)}
            </span>
          </div>
        </div>

        <p className="mt-32 py-4 font-semibold text-gray-500">Descrição:</p>
        <p className="min-h-32 rounded border border-gray-200 p-2">
          {task.description}
        </p>
      </div>
      <button
        onClick={handleTaskCompletion}
        className="bg-green-600 text-white rounded-xl py-4 mt-auto mb-8 mx-48 space-x-4 hover:ring-4 hover:ring-green-200 duration-300"
      >
        <i className="bi bi-check-circle"></i>
        <span>Tarefa Finalizada</span>
      </button>

      {deleteModal && (
        <DeleteTaskModal
          handleDeleteModal={handleDeleteModal}
          handleDeleteTask={handleDeleteTask}
        />
      )}

      {editModal && (
        <AddTaskModal
          handleDisplayModal={() => setEditModal(false)}
          task={task}
          isEdit={true}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskDetails;
