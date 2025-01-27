// import React from 'react'
import { useTranslation } from 'react-i18next';
import { useGetSystemCommonQuery, useUpdateSystemCommonMutation } from '../../../app/services/server';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StyledRadio from "@/components/styled/Radio";
import { useAppSelector } from '../../../app/store';
import SettingBlock from './SettingBlock';
// type Props = {}

const Index = () => {
    const currStatus = useAppSelector(store => !!store.server.show_user_online_status);
    const { t } = useTranslation("setting", { keyPrefix: "overview.online_status" });
    const { t: ct } = useTranslation();
    const { refetch } = useGetSystemCommonQuery();
    const [updateSetting, { isSuccess }] = useUpdateSystemCommonMutation();
    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(ct("tip.update"));
        }
    }, [isSuccess]);
    const handleToggle = () => {
        updateSetting({ show_user_online_status: !currStatus });
    };
    // if (!loadSuccess) return null;
    return (
        <SettingBlock title={t("title")} desc={t('desc')} >
            <StyledRadio
                options={[t("enable"), t("disable")]}
                values={["true", "false"]}
                value={`${currStatus}`}
                onChange={handleToggle}
            />
        </SettingBlock>
    );
};

export default Index;