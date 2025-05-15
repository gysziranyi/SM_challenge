import { useEffect, useState } from "react";
import {
  maxUsers,
  minimumOccurrencesOfPrimeDigit,
  numberOfVisibleUsers,
} from "../constants";
import { MoonLoader } from "react-spinners";
import { fetchUsers } from "../api/randomuser";
import { User } from "../api/types/api";
//import resolveConfig from 'tailwindcss/resolveConfig'
//import tailwindConfig from '../../tailwind.config.js'

enum QueryType {
  ALL = "ALL",
  SEED = "SEED",
}

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [sex, setSex] = useState<"female" | "male" | "">("");
  // const [queryType, setQueryType] = useState<QueryType>(QueryType.ALL);

  // const twFullConfig = resolveConfig(tailwindConfig);
  // const colors = twFullConfig.theme.colors["darkGreen"] as {[key:string]:string};

  // typeof User.location.postalcode
  const countPrimeDigits = (postalcode: number | string): number => {
    const primeDigits = new Set(["2", "3", "5", "7"]);
    return String(postalcode)
      .split("")
      .filter((char) => primeDigits.has(char)).length;
  };

  useEffect(
    () => {
      const loadUsers = async () => {
        try {
          const { results } = await fetchUsers(maxUsers);
          const usersHavingPrimes = results.filter(
            (u) =>
              countPrimeDigits(u.location.postcode) >=
              minimumOccurrencesOfPrimeDigit
          );
          console.log(usersHavingPrimes);
          console.log(usersHavingPrimes.length);
          setUsers(usersHavingPrimes);
        } catch (error) {
          console.error("Hiba a felhasználók lekérésekor:", error);
        } finally {
          setLoading(false);
        }
      };
      loadUsers();
    },
    [
      /* queryType */
    ]
  );

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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setSex(event.target.value as "" | "female" | "male");
  };

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleNext = () => setPage((prev) => prev + 1);

  return (
    <div>
      <h2 className="text-theme-color-14 text-lg">Felhasználók listája:</h2>

      <div className="flex justify-end">
        <div className="flex gap-2">
          <div className="flex gap-2">
            <label htmlFor="postcode">Irányítószám:</label>
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
            <div className="flex gap-2">
              <label htmlFor="sex">Nem:</label>
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
            <div className="w-1/3 p-1">Irányítószám</div>
            <div className="w-1/3 p-1">Nem</div>
            <div className="w-1/3 p-1">Név</div>
          </li>
          {loading ? (
            <div className="flex w-full justify-center my-10">
              <MoonLoader
                color={"grey"}
                loading={loading}
                size={100}
                speedMultiplier={0.5}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {visibleUsers.map((user: User, index) => (
                <li key={index} className="flex w-full">
                  <div className="w-1/3 p-1">{user.location.postcode}</div>
                  <div className="w-1/3 p-1">
                    {user.gender === "female" ? "Nő" : "Férfi"}
                  </div>
                  <div className="w-1/3 p-1">
                    {user.name.title} {user.name.first} {user.name.last}
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      <div className="w-full h-24 flex justify-center items-center">
        <div className="w-1/2 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="bg-theme-color-14 w-8 h-8 bg-[url('/src/assets/chevron-left.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer disabled:bg-grey"
            title="Előző"
          ></button>
          <button
            onClick={handleNext}
            disabled={page === Math.ceil(users.length / numberOfVisibleUsers)}
            className="bg-theme-color-14 w-8 h-8 bg-[url('/src/assets/chevron-right.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer disabled:bg-grey"
            title="Következő"
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
