import { Badge, Button, Card, Loading, Popover, Text } from "@nextui-org/react";
import {
  collection,
  deleteDoc,
  doc,
  FieldPath,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/clientApp";
import NoUser from "../NoPage/NoUser";
import Link from "next/link";
import { DeleteDocumentIcon } from "../SVG/DeleteDocumentIcon";
import { DeleteCodeSnippet } from "../NonModal/DeleteCodeSnippet";
import { EditDocumentIcon } from "../SVG/EditDocumentIcon";
import { LoginIcon } from "../SVG/LoginIcon";
import { Paper } from "../SVG/Paper";
import { MdRefresh } from "react-icons/md";
import { TbSortDescending } from "react-icons/tb";

const MyCodeSnippets = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [myCodeSnippets, setMyCodeSnippets] = useState();
  const [lastSnippet, setLastSnippet] = useState();
  const [update, setUpdate] = useState(false);

  const [truncate, setTruncate] = useState(50);

  const [isEmpty, setIsEmpty] = useState(false);

  const [allOpenStates, setAllOpenStates] = useState({});

  const getMySnippets = async () => {
    try {
      const snippetQuery = query(
        collection(db, "CodeSnippetsData1"),
        where(new FieldPath("userData", "uid"), "==", user?.uid),
        orderBy("postedAt", "desc"),
        limit(10)
      );
      const snippetDocs = await getDocs(snippetQuery);

      const colEmpty = snippetDocs.docs.length === 0;

      if (snippetDocs.docs.length < 10) {
        setIsEmpty(true);
      }

      if (!colEmpty) {
        const lastDoc = snippetDocs.docs[snippetDocs.docs.length - 1];
        const snippets = snippetDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastSnippet(lastDoc);
        setMyCodeSnippets(snippets);
        setLoading(false);
      } else {
        setIsEmpty(true);
        setLoading(false);
      }
    } catch (error) {
      console.log("getPosts error", error.message);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    try {
      const snippetQuery = query(
        collection(db, "CodeSnippetsData1"),
        where(new FieldPath("userData", "uid"), "==", user?.uid),
        orderBy("postedAt", "desc"),
        startAfter(lastSnippet),
        limit(10)
      );
      const snippetDocs = await getDocs(snippetQuery);

      const colEmpty = snippetDocs.size === 0;

      if (!colEmpty) {
        const lastDoc = snippetDocs.docs[snippetDocs.docs.length - 1];
        const snippets = snippetDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastSnippet(lastDoc);

        setMyCodeSnippets((prev) => [...prev, ...snippets]);
        setLoading(false);
      } else {
        setIsEmpty(true);
        setLoading(false);
      }
    } catch (error) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getMySnippets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "CodeSnippetsData1", id));
      setUpdate(!update);
    } catch (error) {
      console.log("Fejl i sletning!", error.message);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1100px)").matches) {
        setTruncate(90);
      } else if (window.matchMedia("(min-width: 900px)").matches) {
        setTruncate(60);
      } else if (window.matchMedia("(min-width: 600px)").matches) {
        setTruncate(40);
      } else if (window.matchMedia("(min-width: 400px)").matches) {
        setTruncate(20);
      }
    });
  }, [truncate]);

  return (
    <div className="min-h-[70vh]">
      {user ? (
        <div>
          <div className="mb-3 flex gap-1">
            <Text>
              <TbSortDescending />
            </Text>
            <Text transform="uppercase" h5>
              Alle kode SNIPS
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            {myCodeSnippets && (
              <>
                {myCodeSnippets?.map((snip, index) => (
                  <div key={index} className="hoverable-item flex gap-2">
                    <Link href={`/s/${snip.id}`}>
                      <div className="hoverable-item w-full">
                        <Card
                          isPressable
                          variant="flat"
                          css={{ mw: "100%", padding: "$0" }}
                          key={snip.id}
                        >
                          <div className="cardHover bg-[#F1F7FF] hoverable-item flex gap-3 items-center p-2 border-b rounded-xl w-full">
                            <div className="w-full flex flex-col gap-2">
                              <div className="flex gap-6 items-center">
                                <div className="pl-3">
                                  <Paper
                                    fill="#0072F5"
                                    className="cursor-pointer"
                                    width={50}
                                    height={50}
                                  />
                                </div>

                                <div className="w-full flex flex-col justify-center gap-3 MonoHeading">
                                  <div className="w-full">
                                    <p className="text-[#031B4E] text-lg font-[500] truncateText">
                                      {snip.title}
                                    </p>
                                  </div>
                                  {snip.description && (
                                    <div className="-mt-2 h-5">
                                      <h6 className="text-[#031b4ed4] whitespace-nowrap MonoHeading truncateText">
                                        {snip.description}
                                      </h6>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-24 flex justify-center">
                                  {snip.folder.folderSnippetType === "code" && (
                                    <div className="pr-[.60rem]">
                                      <Badge
                                        isSquared
                                        color="primary"
                                        variant="flat"
                                      >
                                        KODE
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between w-full MonoHeading">
                                  <div className="flex gap-2">
                                    <div
                                      className={`l${snip.category.langId} lBadge rounded-3xl flex justify-center items-center`}
                                    >
                                      <p className="text-xs MonoHeading font-semibold lowercase">
                                        {snip.folder.language?.label}
                                      </p>
                                    </div>
                                    {snip.folder?.framework.frameworkId && (
                                      <div
                                        className={`f${snip.folder.framework.frameworkId} lBadge rounded-3xl flex justify-center items-center`}
                                      >
                                        <p className="text-xs MonoHeading font-semibold lowercase">
                                          {snip.folder.framework?.label}
                                        </p>
                                      </div>
                                    )}
                                    {snip?.folder?.processor.processorId && (
                                      <div
                                        className={`p${snip.folder?.processor.processorId} lBadge rounded-3xl flex justify-center items-center`}
                                      >
                                        <p className="text-xs MonoHeading font-semibold lowercase">
                                          {snip.folder.processor?.label}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-3 text-[#031B4E]">
                                    {snip.updatedAt && (
                                      <p className="text-xs font-mono">
                                        OPDATERET:&nbsp;
                                        {new Date(
                                          snip.updatedAt.seconds * 1000
                                        ).toLocaleDateString("da-DK")}
                                      </p>
                                    )}

                                    <p className="text-xs font-mono">
                                      OPRETTET:&nbsp;
                                      {new Date(
                                        snip.postedAt.seconds * 1000
                                      ).toLocaleDateString("da-DK")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="hoverable-show">
                              <LoginIcon
                                width={30}
                                height={30}
                                fill="#0072F5"
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Link>
                    <div className="hoverable-show flex flex-col gap-1 justify-center items-center">
                      <div>
                        <a href={`/upsert/code/${snip.id}`}>
                          <Button auto light>
                            <EditDocumentIcon
                              fill="#0072F5"
                              className="cursor-pointer"
                              width={26}
                              height={26}
                            />
                          </Button>
                        </a>
                      </div>
                      <div>
                        <Popover
                          placement="bottom"
                          isOpen={allOpenStates[index]}
                          onOpenChange={(nowOpen) =>
                            setAllOpenStates((oldState) => ({
                              ...oldState,
                              [index]: nowOpen,
                            }))
                          }
                        >
                          <Popover.Trigger>
                            <Button auto light>
                              <DeleteDocumentIcon
                                fill="#F31260"
                                className="cursor-pointer"
                                width={26}
                                height={26}
                              />
                            </Button>
                          </Popover.Trigger>
                          <Popover.Content>
                            <DeleteCodeSnippet
                              snip={snip}
                              handleDelete={handleDelete}
                              setAllOpenStates={setAllOpenStates}
                              index={index}
                            />
                          </Popover.Content>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}

                {!isEmpty && (
                  <div className="flex justify-center">
                    <Button size="sm" onClick={fetchMore}>
                      <MdRefresh />
                      HENT MERE
                    </Button>
                  </div>
                )}
              </>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-[20vh]">
                <Loading size="lg" />
              </div>
            ) : (
              <>
                {!myCodeSnippets && (
                  <div className="flex justify-center">
                    <Text b>Du har ingen kode SNIPS! 😔</Text>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <NoUser />
        </div>
      )}
    </div>
  );
};

export default MyCodeSnippets;
