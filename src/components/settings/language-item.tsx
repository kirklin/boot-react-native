import type { OptionType } from "~/components/ui";

import type { Language } from "~/lib/i18n/resources";
import * as React from "react";
import { Options, useModal } from "~/components/ui";
import { translate, useSelectedLanguage } from "~/lib";

import { Item } from "./item";

export function LanguageItem() {
  const { language, setLanguage } = useSelectedLanguage();
  const modal = useModal();
  const onSelect = React.useCallback(
    (option: OptionType) => {
      setLanguage(option.value as Language);
      modal.dismiss();
    },
    [setLanguage, modal],
  );

  const langs = React.useMemo(
    () => [
      { label: translate("settings.english"), value: "en" },
      { label: translate("settings.arabic"), value: "ar" },
      { label: translate("settings.chinese"), value: "zh" },
    ],
    [],
  );

  const selectedLanguage = React.useMemo(
    () => langs.find(lang => lang.value === language),
    [language, langs],
  );

  return (
    <>
      <Item
        text="settings.language"
        value={selectedLanguage?.label}
        onPress={modal.present}
      />
      <Options
        ref={modal.ref}
        options={langs}
        onSelect={onSelect}
        value={selectedLanguage?.value}
      />
    </>
  );
}
