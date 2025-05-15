import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { fetchUsers } from "../api/randomuser";
import { User } from "../api/types/api";
import { UserSelect } from "../components/UserSelect";
import { UserInputField } from "../components/UserInputfield";
import { UserList } from "../components/UserList";
import { maxUsers, minimumOccurrencesOfPrimeDigit } from "../constants";
import { countPrimeDigits } from "../utils/userUtils";

export const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sex, setSex] = useState<"female" | "male" | "">("");
  const [postcode, setPostcode] = useState<string>("");

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSex(event.target.value as "" | "female" | "male");
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { results } = await fetchUsers(maxUsers);
        setUsers(
          results.filter(
            (u) =>
              countPrimeDigits(u.location.postcode) >=
              minimumOccurrencesOfPrimeDigit
          )
        );
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Hiba a felhasználók lekérésekor: ${error.message}`);
        } else {
          toast.error("Ismeretlen hiba történt.");
        }
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      <h2 className="text-theme-color-14 text-lg mb-4">
        Felhasználók listája:
      </h2>

      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <UserInputField
            id="postcode"
            name="postcode"
            label="Irányítószám"
            pattern=".*\S+.*"
            placeholder=" "
            handleChange={handleChangeInput}
            data-testid="postcode"
          />

          <UserSelect
            id="sex"
            name="sex"
            label="Nem"
            options={[
              { label: "", value: "" },
              { label: "Nő", value: "female" },
              { label: "Férfi", value: "male" },
            ]}
            handleChange={handleChange}
          />
        </div>
      </div>

      <UserList users={users} sex={sex} postcode={postcode}></UserList>
    </div>
  );
};
