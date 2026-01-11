import React, { useMemo, useState } from "react";
import "./ManagerRotaPage.scss";


import { Header } from "../../../../components/Header/header";
import { NavTabs } from "../../../../components/NavTabs/navTabs";
import { StatsGrid } from "../../../../components/StatsGrid/statsGrid";
import { TabPanel } from "../../../../components/TabPanel/tabPanel";
import { MANAGER_ROTA_MOCK } from "../../../../__mocks__/managerRota.mock";
import type { ManagerRotaData, ManagerRotaHandlers, ManagerTabKey, FilterBarState } from "../../Types/managerRota.models";
import { FilterBar } from "../../../../components/FilterBar/filterBar";
import { AnalyticsGrid } from "../../../../components/AnalyticsGrid/analyticsGrid";
import { CoverageView } from "../../../../components/CoverageView/coverageView";
import { OverrideForm } from "../../../../components/OverrideForm/overrideForm";
import { PerformanceTable } from "../../../../components/PerformanceTable/performanceTable";
import { QuickActions } from "../../../../components/QuickActions/quickActions";
import { RequestCard } from "../../../../components/RequestCard/requestCard";
import { ScheduleTable } from "../../../../components/ScheduleTable/scheduleTable";

type Props = {
    data?: ManagerRotaData;
    handlers?: ManagerRotaHandlers;
};

const ManagerRotaPage: React.FC<Props> = ({ data = MANAGER_ROTA_MOCK, handlers }) => {
    const [activeTab, setActiveTab] = useState<ManagerTabKey>("overview");
    const [filters, setFilters] = useState<FilterBarState>(data.schedule.initialFilters);

    const h = useMemo<ManagerRotaHandlers>(
        () => ({
            onApplyFilters: handlers?.onApplyFilters ?? ((f) => alert(`Apply filters: ${JSON.stringify(f)}`)),
            onExportWeek: handlers?.onExportWeek ?? ((f) => alert(`Export week: ${JSON.stringify(f)}`)),
            onQuickAction: handlers?.onQuickAction ?? ((id) => alert(`Quick action: ${id}`)),
            onRequestAction: handlers?.onRequestAction ?? ((id, action) => alert(`Request ${action}: ${id}`)),
            onSubmitOverride: handlers?.onSubmitOverride ?? (() => alert("Override created.")),
            onResetOverride: handlers?.onResetOverride ?? (() => alert("Override form reset.")),
            onFillVacancy: handlers?.onFillVacancy ?? ((homeId) => {
                setActiveTab("override");
                alert(`Fill vacancy for home: ${homeId}`);
            }),
        }),
        [handlers]
    );

    return (
        <div className="manager-rota-page">
            <div className="mr-shell">
                <Header
                    title={data.headerTitle}
                    subtitle={data.headerSubtitle}
                    userName={data.user.name}
                    userRoleText={data.user.roleText}
                />

                <NavTabs
                    variant="manager"
                    tabs={data.tabs}
                    active={activeTab}
                    onChange={setActiveTab}
                    ariaLabel="Manager rota tabs"
                />

                <div className="mr-content">
                    <TabPanel active={activeTab === "overview"}>
                        <StatsGrid stats={data.stats} />

                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 20 }}>
                            <div>
                                <h2 className="mr-sectionTitle">{data.overview.todayTitle}</h2>
                                <ScheduleTable
                                    mode="daily"
                                    columns={["Employee", "Shift", "Location", "Children", "Status"]}
                                    rows={data.overview.todayRows}
                                />
                            </div>

                            <QuickActions
                                title={data.overview.quickActionsTitle}
                                actions={data.overview.quickActions}
                                onAction={h.onQuickAction}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel active={activeTab === "schedule"}>
                        <FilterBar
                            homes={data.schedule.homes}
                            staffGroups={data.schedule.staffGroups}
                            value={filters}
                            onChange={setFilters}
                            onApply={() => h.onApplyFilters?.(filters)}
                            onExport={() => h.onExportWeek?.(filters)}
                        />

                        <ScheduleTable
                            mode="weekly"
                            columns={data.schedule.columns}
                            weeklyRows={data.schedule.rows}
                        />
                    </TabPanel>

                    <TabPanel active={activeTab === "requests"}>
                        <h2 className="mr-sectionTitle">{data.requests.leaveTitle}</h2>
                        <div style={{ display: "grid", gap: 15 }}>
                            {data.requests.leaveCards.map((c) => (
                                <RequestCard
                                    key={c.id}
                                    card={c}
                                    onAction={(action) => h.onRequestAction?.(c.id, action)}
                                />
                            ))}
                        </div>

                        <h2 className="mr-sectionTitle" style={{ marginTop: 30 }}>
                            {data.requests.swapTitle}
                        </h2>
                        <div style={{ display: "grid", gap: 15 }}>
                            {data.requests.swapCards.map((c) => (
                                <RequestCard
                                    key={c.id}
                                    card={c}
                                    onAction={(action) => h.onRequestAction?.(c.id, action)}
                                />
                            ))}
                        </div>
                    </TabPanel>

                    <TabPanel active={activeTab === "override"}>
                        <OverrideForm
                            title={data.override.title}
                            employeeOptions={data.override.employeeOptions}
                            homeOptions={data.override.homeOptions}
                            shiftOptions={data.override.shiftOptions}
                            overrideTypeOptions={data.override.overrideTypeOptions}
                            priorityOptions={data.override.priorityOptions}
                            childrenOptions={data.override.childrenOptions}
                            onSubmit={h.onSubmitOverride}
                            onReset={h.onResetOverride}
                        />

                        <h2 className="mr-sectionTitle" style={{ marginTop: 30 }}>
                            {data.override.recentTitle}
                        </h2>

                        <div style={{ display: "grid", gap: 15 }}>
                            {data.override.recentCards.map((c) => (
                                <RequestCard
                                    key={c.id}
                                    card={{
                                        id: c.id,
                                        urgency: "normal",
                                        avatarEmoji: c.avatarEmoji,
                                        title: c.title,
                                        meta: c.meta,
                                        reasonText: c.reason,
                                        actions: [{ key: "review", label: "👁️ Details", tone: "review" }],
                                    }}
                                    rightPillText={c.statusPillText}
                                    onAction={(action) => h.onRequestAction?.(c.id, action)}
                                />
                            ))}
                        </div>
                    </TabPanel>

                    <TabPanel active={activeTab === "coverage"}>
                        <h2 className="mr-sectionTitle">{data.coverage.title}</h2>
                        <CoverageView homes={data.coverage.homes} onFillVacancy={h.onFillVacancy} />
                    </TabPanel>

                    <TabPanel active={activeTab === "analytics"}>
                        <h2 className="mr-sectionTitle">{data.analytics.title}</h2>
                        <AnalyticsGrid charts={data.analytics.charts} />

                        <h2 className="mr-sectionTitle" style={{ marginTop: 30 }}>
                            {data.analytics.performanceTitle}
                        </h2>
                        <PerformanceTable rows={data.analytics.performanceRows} />
                    </TabPanel>
                </div>
            </div>
        </div>
    );
};

export default ManagerRotaPage;
