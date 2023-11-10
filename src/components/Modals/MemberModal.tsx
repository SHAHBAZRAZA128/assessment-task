import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import emailjs from "emailjs-com";
import axios from "axios";
import { AccessLevel, Member } from "../../types/types";
type ModalProps = {
  onClose: () => void;
  setIsSent: Dispatch<SetStateAction<boolean>>;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
};

const accessLevels: AccessLevel[] = [
  {
    value: "Signatory",
    label: "Signatory",
    details:
      "Has no right to sign transactions. Can change company settings and can invite new members.",
  },
  {
    value: "Manager",
    label: "Manager",
    details:
      "Has the right to sign transactions. Can change company settings and can invite new members.",
  },
  {
    value: "Viewer",
    label: "Viewer",
    details: "Has read-only access.",
  },
];

const serviceId = "service_28pr0bf";
const templateId = "template_mukriuq";
const userId = "xhWlWkxS0QzFgyl4h";

const MemberModal: React.FC<ModalProps> = ({
  onClose,
  setIsSent,
  setMembers,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(accessLevels[0]);

  const handleAccessLevelChange = (newAccessLevel: AccessLevel): void => {
    setAccessLevel(newAccessLevel);
    setIsOpen(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const getUsernameFromEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      return email.slice(0, atIndex);
    }
    return null;
  };
  const sendInvite = () => {
    const encodedEmail = encodeURIComponent(email);
    const encodedAccessLevel = encodeURIComponent(accessLevel.value);
    const username = getUsernameFromEmail(email);
    setIsLoading(true);
    const inviteLink = `http://localhost:3000/members`;
    const url = `http://localhost:8000/members?email=${encodedEmail}&accessLevel=${encodedAccessLevel}&username=${username}`;
    const templateParams = {
      to_email: email,
      from_name: "SHAHBAZ RAZA",
      invite_link: inviteLink,
      access_level: accessLevel.label,
      access_details: accessLevel.details,
    };

    emailjs.send(serviceId, templateId, templateParams, userId).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setIsSent(true);
        onClose();
        axios.post(url).then(
          (response) => {
            setMembers((prevMembers) => [...prevMembers, response.data]);
            console.log("POST Request Success", response.data);
            // Handle the response data if needed
            setIsLoading(false);
          },
          (error) => {
            console.error("POST Request Error", error);
            setIsLoading(false);
            // Handle errors if necessary
          }
        );
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-2/5 h-4/5 flex flex-col relative">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Invite Person</h2>
            <button
              onClick={onClose}
              className="text-gray-800 hover:text-black focus:outline-none"
            >
              X
            </button>
          </div>
          <div className="mt-4">
            <label
              htmlFor="email"
              className="text-left block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter email"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="accessLevel"
              className="text-left block text-sm font-medium text-gray-700"
            >
              Access Level
            </label>
            <div className="relative w-full inline-block text-left">
              <div>
                <span className="rounded-md shadow-sm">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full rounded-md border border-gray-300 p-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50   "
                    onClick={() => setIsOpen(!isOpen)}
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    {accessLevel.label}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M6 8l4 4 4-4H6z" />
                    </svg>
                  </button>
                </span>
              </div>
              {isOpen && (
                <div
                  className="origin-top-right w-auto absolute right-0 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  style={{ zIndex: 50 }}
                >
                  <div
                    className="py-1 w-full"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {accessLevels.map((level) => (
                      <div
                        key={level.value}
                        onClick={() => handleAccessLevelChange(level)}
                        className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        role="menuitem"
                      >
                        <div className="mb-1">{level.label}</div>
                        <div className="text-xs text-gray-500">
                          {level.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          {isLoading ? (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              onClick={sendInvite}
            >
              Send Invitation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
