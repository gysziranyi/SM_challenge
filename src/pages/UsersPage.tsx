import { useState, useEffect } from "react";
import { InputField } from "../components/inputfield";
import { UserSelect } from "../components/UserSelect";
import { User } from "../api/types/api";
import { fetchUsers } from "../api/randomuser";
import { maxUsers, minimumOccurrencesOfPrimeDigit } from "../constants";
import { countPrimeDigits } from "../utils/userUtils";
import { UserList } from "../components/UserList";

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
        console.error("Hiba a felhasználók lekérésekor:", error);
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      <h2 className="text-theme-color-14 text-lg mb-4">
        Felhasználók listája:
      </h2>

      <div className="flex justify-end">
        <div className="flex gap-2">
          <InputField
            id="postcode"
            label="Irányítószám"
            pattern=".*\S+.*"
            placeholder=" "
            handleChange={handleChangeInput}
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
