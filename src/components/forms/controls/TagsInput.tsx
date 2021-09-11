import { FunctionComponent, useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
// import FormControl from 'react-bootstrap/FormControl';
import { Form, Badge } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';

export type TagsInputProp = {
  tags: string;
  setTags?: (value: string) => void;
  label?: string;
  readOnly?: boolean | null;
  max?: number;
};
const TagsInput: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { t } = useTranslation('createWorkForm');
  const { tags, setTags, label = '', readOnly = false, max = 2 } = props;

  const [tagInput, setTagInput] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (tags) setItems(tags.split(','));
  }, [tags]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.currentTarget.value);
  };

  const onKeyPressOnInput = (e: KeyboardEvent) => {
    if (['Enter', 'Comma'].includes(e.code)) {
      e.preventDefault();
      if (tagInput) {
        if (max > items.length) {
          items.push(tagInput);
          setItems([...items]);
          if (setTags) setTags(items.join());
        }
      }
      (e.currentTarget as HTMLInputElement).value = '';
    }
  };

  const deleteTag = (idx: number): void => {
    items.splice(idx, 1);
    if (setTags) setTags(items.join());
  };

  return (
    <Form.Group controlId="tags">
      {label && <Form.Label>{label}</Form.Label>}
      <div>
        {items.map((v, idx) => {
          return (
            <span key={`${idx + 1}${t}`}>
              <Badge pill variant="primary">
                {v}{' '}
                {!readOnly && (
                  <Badge style={{ cursor: 'pointer' }} onClick={() => deleteTag(idx)} pill variant="default">
                    X
                  </Badge>
                )}
              </Badge>{' '}
            </span>
          );
        })}
        {!readOnly && items.length < max && (
          <Form.Control
            type="text"
            placeholder={t('tagsInputPlaceholder')}
            onChange={onChangeInput}
            onKeyPress={onKeyPressOnInput}
          />
        )}
      </div>
    </Form.Group>
  );
};

export default TagsInput;
