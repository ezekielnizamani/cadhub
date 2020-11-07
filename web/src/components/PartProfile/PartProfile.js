import {useState, useEffect} from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import Editor from "rich-markdown-editor";

import ImageUploader from 'src/components/ImageUploader'
import Breadcrumb from 'src/components/Breadcrumb'
import EmojiReaction from 'src/components/EmojiReaction'
import Button from 'src/components/Button'

const PartProfile = ({userPart, isEditable, onSave, loading, error}) => {
  const { currentUser } = useAuth()
  const canEdit = currentUser?.sub === userPart.id
  const part = userPart?.Part
  useEffect(() => {isEditable &&
    !canEdit &&
    navigate(routes.part2({userName: userPart.userName, partTitle: part.title}))},
  [currentUser])
  const [input, setInput] = useState({
    title: part.title,
    mainImage: part.mainImage,
    description: part.description,
  })
  const setProperty = (property, value) => setInput({
    ...input,
    [property]: value,
  })
  const onTitleChange = ({target}) => setProperty('title', target.value)
  const onDescriptionChange = (description) => setProperty('description', description())
  const onImageUpload = ({cloudinaryPublicId}) => setProperty('mainImage', cloudinaryPublicId)
  const onEditSaveClick = () => {
    if (isEditable) {
      onSave(part.id, input)
      return
    }
    navigate(routes.editPart2({userName: userPart.userName, partTitle: part.title}))
  }
  return (
    <>
      <div className="grid mt-20 gap-8" style={{gridTemplateColumns: 'auto 12rem minmax(12rem, 42rem) auto'}}>

        {/* Side column */}
        <aside className="col-start-2 relative">
          <ImageUploader
            className="rounded-half rounded-br-lg shadow-md border-2 border-gray-200 border-solid"
            onImageUpload={() => {}}
            aspectRatio={1}
            imageUrl={userPart.image === 'abc' ? '': userPart.image}
          />
          <h4 className="text-indigo-800 text-xl underline text-right py-4">{userPart?.name}</h4>
          <div className="h-px bg-indigo-200 mb-4" />
          {/* TODO hook up to emoji data properly */}
          <EmojiReaction
            // emotes={[{emoji: '❤️',count: 3},{emoji: '😁',count: 2},{emoji: '😜',count: 2},{emoji: '🤩',count: 2},{emoji: '🤣',count: 2},{emoji: '🙌',count: 2},{emoji: '🚀',count: 2}]}
            emotes={[{emoji: '❤️',count: 3},{emoji: '😁',count: 2}]}
            // emotes={[]}
            onEmote={() => {}}
          />
          <Button
            className="mt-6 ml-auto hover:shadow-lg bg-gradient-to-r from-transparent to-indigo-100"
            shouldAnimateHover
            iconName="chevron-down"
            onClick={() => {}}
          >
            Comments 11
          </Button>
          <Button
            className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200"
            shouldAnimateHover
            iconName="terminal"
            onClick={() => {}}
          >
            Open IDE
          </Button>
          {canEdit && <Button
            className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200 relative z-20"
            shouldAnimateHover
            iconName={isEditable ? 'save' : 'pencil'}
            onClick={onEditSaveClick}
          >
            {isEditable ? 'Save Details' : 'Edit Details'}
          </Button>}
          {isEditable && <div className="absolute inset-0 bg-gray-300 opacity-75 z-10 transform scale-x-110 -ml-1 -mt-2" />}
        </aside>

        {/* main project center column */}
        <section className="col-start-3">
          <Breadcrumb className="inline" onPartTitleChange={isEditable && onTitleChange} userName={userPart.userName} partTitle={input?.title}/>
          { input?.mainImage && <ImageUploader
            className="rounded-lg shadow-md border-2 border-gray-200 border-solid mt-8"
            onImageUpload={onImageUpload}
            aspectRatio={16/9}
            isEditable={isEditable}
            imageUrl={input?.mainImage}
          />}
          <div name="description" className="markdown-overrides rounded-lg shadow-md bg-white p-12 my-8 min-h-md">
            <Editor
              defaultValue={part?.description || ''}
              readOnly={!isEditable}
              onChange={onDescriptionChange}
            />
          </div>
        </section>

      </div>
    </>
  )
}

export default PartProfile
