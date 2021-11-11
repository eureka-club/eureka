import { FunctionComponent, useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
// import FormControl from 'react-bootstrap/FormControl';
import { Form, Badge } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import searchEngine from '../../../atoms/searchEngine';

export type TagsInputProp = {
  tags: string;
  setTags?: (value: string) => void;
  label?: string;
  readOnly?: boolean | null;
  max?: number;
  className?: string;
  formatValue?: (v: string) => string;
};
const TagsInput: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { t } = useTranslation('createWorkForm');
  const { tags, setTags, label = '', readOnly = false, max = 2, className, formatValue = undefined } = props;

  const [tagInput, setTagInput] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  const router = useRouter();
  const [, setSearchEngineState] = useAtom(searchEngine);

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
  const handlerBadgeClick = (v: string) => {
    const where = encodeURIComponent(
      JSON.stringify({
        OR: [
          { tags: { contains: v } },
          { topics: { contains: v } },
          { contentText: { contains: v } },
          { title: { contains: v } },
        ],
      }),
    );
    setSearchEngineState((res) => ({ ...res, where, q: v }));
    router.push('/search');
  };
  return (
    <Form.Group controlId="tags" className={`${className}`}>
      {label && <Form.Label>{label}</Form.Label>}
      <div>
        {items.map((v, idx) => {
          return (
            <span key={`${idx + 1}${t}`}>
              <Badge
                className="fw-light fs-6 cursor-pointer"
                pill
                bg="secondary px-2 py-1 mb-1 me-1"
                onClick={() => handlerBadgeClick(v)}
              >
                {formatValue ? formatValue(v) : v}{' '}
                {!readOnly && (
                  <Badge style={{ cursor: 'pointer' }} onClick={() => deleteTag(idx)} pill bg="default">
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
