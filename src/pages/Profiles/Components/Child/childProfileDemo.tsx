import { CHILD_PROFILE_MOCK } from "../../../../__mocks__/childProfile.mock";
import ChildProfile from "./childProfile";

const ChildProfileDemo = () => {
    return <ChildProfile {...CHILD_PROFILE_MOCK} />;
}

export default ChildProfileDemo;
