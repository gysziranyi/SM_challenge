import { useEffect, useState } from "react";
import {
  numberOfVisibleUsers,
} from "../constants";
import { MoonLoader } from "react-spinners";
import { User } from "../api/types/api";

export interface UserListProps {
  users: User[];
  sex?: "female" | "male" | "";
  postcode?: string;
}

export const UserList = (props: UserListProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<User[] | null>(null);
  const [page, setPage] = useState<number>(1);

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleNext = () => setPage((prev) => prev + 1);
  
  useEffect(() => {
    if (props.users.length > 0) {
      let filtered = [...props.users];
      if (props.sex) {
        filtered = filtered.filter((u) => u.gender === props.sex);
      }
      if (props.postcode) {
        filtered = filtered.filter((u) => String(u.location.postcode).includes(String(props.postcode)));
      }
      setFilteredUsers(filtered);
      setPage(1);
    }
  }, [props.users, props.sex, props.postcode]);

  useEffect(() => {
    if (filteredUsers.length > 0) {
      const startIndex = (page - 1) * numberOfVisibleUsers;
      setVisibleUsers(
        filteredUsers.slice(startIndex, startIndex + numberOfVisibleUsers)
      );
    }
  }, [filteredUsers, page]);

  return (
    <div>
      <div>
        <ul className="w-full">
          <li className="flex text-lg w-full border-b-[2px] border-theme-color-8">
            <div className="w-1/3 p-1">Irányítószám</div>
            <div className="w-1/3 p-1">Nem</div>
            <div className="w-1/3 p-1">Név</div>
          </li>
          {visibleUsers === null ? (
            <div className="flex w-full justify-center my-10">
              <MoonLoader
                color={"grey"}
                loading={true}
                size={100}
                speedMultiplier={0.5}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {visibleUsers.length > 0 ? visibleUsers.map((user: User, index) => (
                <li key={index} className="flex w-full" data-testid="userRow">
                  <div className="w-1/3 p-1">{user.location.postcode}</div>
                  <div className="w-1/3 p-1">
                    {user.gender === "female" ? "Nő" : "Férfi"}
                  </div>
                  <div className="w-1/3 p-1">
                    {user.name.title} {user.name.first} {user.name.last}
                  </div>
                </li>
              )) : (
                <li className="flex w-full">
                  <div className="w-full p-1">Nincs ilyen felhasználó</div>
                </li>
              )}
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
            data-testid="buttonPrev"
          ></button>
          <button
            onClick={handleNext}
            disabled={page === Math.ceil(filteredUsers.length / numberOfVisibleUsers)}
            className="bg-theme-color-14 w-8 h-8 bg-[url('/src/assets/chevron-right.svg')] bg-no-repeat bg-contain bg-center border-none cursor-pointer disabled:bg-grey"
            title="Következő"
            data-testid="buttonNext"
          ></button>
        </div>
      </div>
    </div>
  );
};
