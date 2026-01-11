import React, { useMemo, useState } from "react";
import "./employeeRota.scss";
import { EMPLOYEE_ROTA_MOCK } from "../../../../__mocks__/employeeRota.mock";
import { CalendarView } from "../../../../components/CalendarView/calendarView";
import { Header } from "../../../../components/Header/header";
import { LeaveRequests } from "../../../../components/LeaveRequests/leaveRequests";
import { NavTabs } from "../../../../components/NavTabs/navTabs";
import { ShiftsList } from "../../../../components/ShiftsList/shiftsList";
import { ShiftSwaps } from "../../../../components/ShiftSwaps/shiftSwaps";
import { StatsGrid } from "../../../../components/StatsGrid/statsGrid";
import { TabPanel } from "../../../../components/TabPanel/tabPanel";
import type { EmployeeRotaData, EmployeeRotaHandlers, RotaTabKey } from "../../Types/exmployeeRota.model";
import { EMPLOYEE_DEC_2024_CALENDAR } from "../../../../__mocks__/calendarView.mock";
import { EMPLOYEE_DEC_2024_SHIFTS } from "../../../../__mocks__/shiftList.mock";



type Props = {
    data?: EmployeeRotaData;
    handlers?: EmployeeRotaHandlers;
    defaultTab?: RotaTabKey;
};
const EmployeeRotaPage: React.FC<Props> = ({
    data = EMPLOYEE_ROTA_MOCK,
    handlers,
    defaultTab = "calendar",
}) => {
    const [activeTab, setActiveTab] = useState<RotaTabKey>(defaultTab);

    const h = useMemo<EmployeeRotaHandlers>(
        () => ({
            onExportSchedule: handlers?.onExportSchedule ?? (() => alert("Exporting schedule...")),
            onPreviousMonth: handlers?.onPreviousMonth ?? (() => alert("Previous month...")),
            onNextMonth: handlers?.onNextMonth ?? (() => alert("Next month...")),

            onViewShiftDetails: handlers?.onViewShiftDetails ?? ((id) => alert(`View shift: ${id}`)),
            onRequestSwapFromShift:
                handlers?.onRequestSwapFromShift ??
                ((id) => {
                    alert(`Request swap for shift: ${id}`);
                    setActiveTab("swap");
                }),

            onSubmitLeave: handlers?.onSubmitLeave ?? (() => alert("Leave request submitted.")),

            onSelectColleague: handlers?.onSelectColleague ?? ((id) => alert(`Swap with colleague: ${id}`)),
            onAcceptSwap: handlers?.onAcceptSwap ?? ((id) => alert(`Accepted swap: ${id}`)),
            onDeclineSwap: handlers?.onDeclineSwap ?? ((id) => alert(`Declined swap: ${id}`)),
        }),
        [handlers]
    );

    return (
        <div className="employee-rota-page">
            <div className="er-shell">
                <Header
                    title={data.headerTitle}
                    subtitle={data.headerSubtitle}
                    userName={data.user.name}
                    userRoleText={`${data.user.roleLabel} • ID: ${data.user.employeeId}`}
                />

                <NavTabs
                    variant="employee"
                    tabs={data.tabs}
                    active={activeTab}
                    onChange={setActiveTab}
                    ariaLabel="Employee rota tabs"
                />
                <div className="er-content">
                    <StatsGrid stats={data.stats} />

                    <TabPanel active={activeTab === "calendar"}>
                        <CalendarView
                            {...EMPLOYEE_DEC_2024_CALENDAR}
                            onPrevious={() => console.log("prev")}
                            onNext={() => console.log("next")}
                            onExport={() => console.log("export")}
                            onSelectDay={(day) => console.log("Selected:", day)}
                        />
                    </TabPanel>

                    <TabPanel active={activeTab === "shifts"}>
                        <ShiftsList
                            title="My Upcoming Shifts"
                            shifts={EMPLOYEE_DEC_2024_SHIFTS}
                            onViewDetails={(id) => alert(`View shift ${id}`)}
                            onRequestSwap={(id) => alert(`Request swap for ${id}`)}
                        />
                    </TabPanel>

                    <TabPanel active={activeTab === "leave"}>
                        <LeaveRequests
                            formTitle={data.leave.formTitle}
                            historyTitle={data.leave.historyTitle}
                            history={data.leave.history}
                            onSubmit={h.onSubmitLeave}
                        />
                    </TabPanel>

                    <TabPanel active={activeTab === "swap"}>
                        <ShiftSwaps
                            introTitle={data.swap.introTitle}
                            introText={data.swap.introText}
                            colleagues={data.swap.colleagues}
                            pendingTitle={data.swap.pendingTitle}
                            incomingTitle={data.swap.incomingTitle}
                            requests={data.swap.requests}
                            onSelectColleague={h.onSelectColleague}
                            onAccept={h.onAcceptSwap}
                            onDecline={h.onDeclineSwap}
                        />
                    </TabPanel>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRotaPage;
