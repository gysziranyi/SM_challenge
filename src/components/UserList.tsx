import React, { useEffect, useState } from "react";
import {
  maxUsers,
  minimumOccurrencesOfPrimeDigit,
  numberOfVisibleUsers,
} from "../constants";
import ChevronRight from "../assets/chevron-right.svg";

export interface Info {
  page: number;
  result: number;
  seed: string;
  version: string;
}

interface User {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number | string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

interface ApiResponse {
  info: Info;
  results: User[];
}

enum QueryType {
  ALL = "ALL",
  SEED = "SEED",
}

const styles = {};

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [sex, setSex] = useState<"female" | "male" | "">("");
  const [queryType, setQueryType] = useState<QueryType>(QueryType.ALL);

  // typeof User.location.postalcode
  const countPrimeDigits = (postalcode: number | string): number => {
    const primeDigits = new Set(["2", "3", "5", "7"]);
    return String(postalcode)
      .split("")
      .filter((char) => primeDigits.has(char)).length;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      // ?results=${numberOfVisibleUsers}
      // &inc=gender,name,location

      const arr = [
        `https://randomuser.me/api?`,
        `results=${
          queryType === QueryType.ALL ? maxUsers : numberOfVisibleUsers
        }`,
        // `&seed=1245af4eb2e88bed`,
        `&inc=gender,name,location`,
      ];

      fetch(arr.join(""))
        .then((response) => response.json())
        .then((data: ApiResponse) => {
          const usersHavingPrimes = data.results.filter(
            (u) =>
              countPrimeDigits(u.location.postcode) >=
              minimumOccurrencesOfPrimeDigit
          );
          console.log(usersHavingPrimes);
          console.log(usersHavingPrimes.length);
          setUsers(usersHavingPrimes);
        })
        .catch((error) => {
          console.error("Hiba történt:", error);
        });
    };
    fetchUsers();
  }, [queryType]);

  useEffect(() => {
    if (users.length > 0) {
      let pool = users;
      if (sex) {
        pool = pool.filter((u) => u.gender === sex);
      }
      const startIndex = (page - 1) * numberOfVisibleUsers;
      setVisibleUsers(
        pool.slice(startIndex, startIndex + numberOfVisibleUsers)
      );
    }
  }, [page, users, sex]);

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setSex(event.target.value);
  };

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleNext = () => setPage((prev) => prev + 1);

  return (
    <div>
      <h2>Felhasználók listája:</h2>

      <div className="cell lp-form-field" data-editorblocktype="Field-dropdown">
        <div data-required-field="true" className="floating-label">
          <select
            className="lp-form-fieldInput floating-select"
            id="41e3e69e-0ac9-eb11-bacc-000d3ab27435"
            name="41e3e69e-0ac9-eb11-bacc-000d3ab27435"
            onChange={handleChange}
            /* value={sex} */
          >
            <option value=""></option>
            <option value="female">Nő</option>
            <option value="male">Férfi</option>
          </select>
          <span className="highlight"></span>
          <label>Nemek:</label>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
        {/* position: "relative" */}
        <ul style={{ listStyle: "none" }}>
          {visibleUsers.map((user: User, index) => (
            /* display: "flex", flexWrap: "wrap"  */
            <li key={index} style={{ display: "flex", width: "100%" }}>
              <div
                style={{ width: "auto", minWidth: "213px", maxWidth: "100%" }}
              >
                {user.location.postcode}
              </div>
              <div
                style={{ width: "auto", minWidth: "213px", maxWidth: "100%" }}
              >
                {user.gender === "female" ? "Nő" : "Férfi"}
              </div>
              <div
                style={{ width: "auto", minWidth: "213px", maxWidth: "100%" }}
              >
                {user.name.title} {user.name.first} {user.name.last}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full h-24 flex justify-center items-center">
        <div className="w-1/2 flex justify-between"
        >
          <button
            onClick={handlePrevious}
            disabled={page === 1}
			className="bg-siemens-blue w-8 h-8 bg-[url('/src/assets/chevron-left.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer"
          ></button>
          <button
            onClick={handleNext}
            disabled={page === Math.ceil(users.length / numberOfVisibleUsers)}
			className="bg-siemens-blue w-8 h-8 bg-[url('/src/assets/chevron-right.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer"
          ></button>
        </div>
      </div>

      {/* <div>{users.length}</div>
	  <div>{numberOfVisibleUsers}</div>
	  <div>{Math.ceil(users.length / numberOfVisibleUsers)}</div> */}
      <div>{page}</div>
    </div>
  );
};
