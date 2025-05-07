// File: components/UserList.js
"use client";

import { useEffect, useState } from "react";

export default function UserList({ currentUser, onSelectUser }) {
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then(setFriends);

    fetch("/api/suggestions")
      .then((res) => res.json())
      .then(setSuggestions);
  }, []);

  const addFriend = async (user) => {
    await fetch("/api/addFriend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId: user.id }),
    });
    setFriends([...friends, user]);
    setSuggestions(suggestions.filter((u) => u.id !== user.id));
  };

  return (
    <div className="w-1/3 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      {friends.map((user) => (
        <div
          key={user.id}
          className="p-3 bg-gray-700 mb-2 rounded-lg cursor-pointer hover:bg-gray-600"
          onClick={() => onSelectUser(user)}
        >
          {user.name}
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-4">Suggestions</h2>
      {suggestions.map((user) => (
        <div
          key={user.id}
          className="p-3 bg-gray-700 mb-2 rounded-lg cursor-pointer hover:bg-gray-600 flex justify-between items-center"
        >
          <span>{user.name}</span>
          <button
            onClick={() => addFriend(user)}
            className="bg-blue-500 px-2 py-1 rounded text-sm"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
