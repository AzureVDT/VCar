import { View, Pressable } from 'react-native';
import React from 'react';
import { Button, Dialog, Paragraph, RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales';

const LanguageDialog = ({
    languageDialogVisible,
    setLanguageDialogVisible,
}: {
    languageDialogVisible: boolean,
    setLanguageDialogVisible: (visible: boolean) => void,
}) => {
    const { t } = useTranslation();


    const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language);
    const handleLanguageChange = (language: string) => setSelectedLanguage(language);

    return (
        <>
            <Dialog visible={languageDialogVisible} onDismiss={() => setLanguageDialogVisible(false)}>
                <Dialog.Title>{t('common.language')}</Dialog.Title>
                <Dialog.Content>
                    <RadioButton.Group onValueChange={handleLanguageChange} value={selectedLanguage}>
                        <View className="flex-row items-center mb-2">
                            <RadioButton value="en" />
                            <Pressable onPress={() => handleLanguageChange('en')}>
                                <Paragraph>{t('common.language.english')}</Paragraph>
                            </Pressable>
                        </View>
                        <View className="flex-row items-center">
                            <RadioButton value="vi" />
                            <Pressable onPress={() => handleLanguageChange('vi')}>
                                <Paragraph>{t('common.language.vietnamese')}</Paragraph>
                            </Pressable>
                        </View>
                    </RadioButton.Group>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        i18n.changeLanguage(selectedLanguage);
                        setLanguageDialogVisible(false);
                    }}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};

export default LanguageDialog;