import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const activeOrganizationIdAtom = atomWithStorage<string | null>('activeOrganizationId', null);


function useActiveOrganizationId() {
    const [organizationId, setOrganizationId] = useAtom(activeOrganizationIdAtom);
    return { organizationId, setOrganizationId };
}

export { useActiveOrganizationId };
