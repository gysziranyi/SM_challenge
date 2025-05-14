import React, { useEffect, useState } from "react";
import {
  maxUsers,
  minimumOccurrencesOfPrimeDigit,
  numberOfVisibleUsers,
} from "../constants";

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
      <h2 className="text-theme-color-14 text-lg">Felhasználók listája:</h2>

      <div className="flex justify-end">
        <div className="flex gap-2">
          <div /* className="floating-label" */>
            <label htmlFor="postcode">Irányítószám: </label>
			
            <input
              className="border-b-[2px] bg-inputFieldBlue border-gray focus:bg-darkGreen focus:border-valid focus:border-teal focus:outline-none focus:ring-0"
              type="text"
              placeholder=" "
              id="postcode"
              name="postcode"
              pattern=".*\S+.*"
            />
          </div>

          <div
            className="cell lp-form-field"
            data-editorblocktype="Field-dropdown"
          >
            <div /* className="floating-label" */>
              <label htmlFor="sex">Nemek:</label>
              <select
                className="border-b-[2px] bg-inputFieldBlue border-gray focus:bg-darkGreen focus:border-valid focus:border-teal focus:outline-none focus:ring-0"
                id="sex"
                name="sex"
                onChange={handleChange}
              >
                <option value=""></option>
                <option value="female">Nő</option>
                <option value="male">Férfi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ul className="w-full" /* style={{ listStyle: "none" }} */>
          <li className="flex text-lg w-full border-b-[2px] border-theme-color-8">
            <div className="w-auto min-w-52 max-w-full p-1">Irányítószám</div>
            <div className="w-auto min-w-52 max-w-full p-1">Nem</div>
            <div className="w-auto min-w-52 max-w-full p-1">Név</div>
          </li>
          {visibleUsers.map((user: User, index) => (
            /* display: "flex", flexWrap: "wrap"  */
            <li key={index} className="flex w-full">
              <div className="w-auto min-w-52 max-w-full p-1">
                {user.location.postcode}
              </div>
              <div className="w-auto min-w-52 max-w-full p-1">
                {user.gender === "female" ? "Nő" : "Férfi"}
              </div>
              <div className="w-auto min-w-52 max-w-full p-1">
                {user.name.title} {user.name.first} {user.name.last}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full h-24 flex justify-center items-center">
        <div className="w-1/2 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="bg-theme-color-14 w-8 h-8 bg-[url('/src/assets/chevron-left.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer"
          ></button>
          <button
            onClick={handleNext}
            disabled={page === Math.ceil(users.length / numberOfVisibleUsers)}
            className="bg-theme-color-14 w-8 h-8 bg-[url('/src/assets/chevron-right.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer"
          ></button>
        </div>
      </div>

      {/* <div>{users.length}</div>
	  <div>{numberOfVisibleUsers}</div>
	  <div>{Math.ceil(users.length / numberOfVisibleUsers)}</div> */}
      {/* <div>{page}</div> */}
    </div>
  );
};
