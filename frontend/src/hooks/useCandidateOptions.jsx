import { useQuery } from "@tanstack/react-query";
import { getJobTitles, getCountryCodes, getSkills, getCareFacilities, getClientNeeds } from '../apis/api.js';

 const useCandidateOptions = () => {
  const jobTitleQuery = useQuery({ queryKey: ["jobTitles"], queryFn: getJobTitles });
  const countryCodeQuery = useQuery({ queryKey: ["countryCodes"], queryFn: getCountryCodes });
  const skillsQuery = useQuery({ queryKey: ["skills"], queryFn: getSkills });
  const careFacilityQuery = useQuery({ queryKey: ["careFacilities"], queryFn: getCareFacilities });
  const clientNeedsQuery = useQuery({ queryKey: ["clientNeeds"], queryFn: getClientNeeds });

  return {
    jobTitleQuery,
    countryCodeQuery,
    skillsQuery,
    careFacilityQuery,
    clientNeedsQuery,
    isLoading:
      jobTitleQuery.isLoading ||
      countryCodeQuery.isLoading ||
      skillsQuery.isLoading ||
      careFacilityQuery.isLoading ||
      clientNeedsQuery.isLoading,
    isError:
      jobTitleQuery.isError ||
      countryCodeQuery.isError ||
      skillsQuery.isError ||
      careFacilityQuery.isError ||
      clientNeedsQuery.isError,
  };
};

export default useCandidateOptions;