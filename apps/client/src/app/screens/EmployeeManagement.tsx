import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, TrendingUp, Award, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useSimulation } from "@/context/SimulationContext";
import {
  employeeExperienceLabel,
  employeeInitials,
  formatMoney,
  generateCompanyEmployees,
} from "@fenix/domain";

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const { world, isLoading } = useSimulation();

  const employees = useMemo(() => {
    if (!world) {
      return [];
    }

    return generateCompanyEmployees(world.company, world.saveId, 8);
  }, [world]);

  if (isLoading || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading employee roster…
      </div>
    );
  }

  const currency = world.origin.currency;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/company")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Company
          </Button>
          <div>
            <h1 className="text-3xl text-[#1C2541]">Employee Management</h1>
            <p className="text-gray-600">
              {world.company.employeeCount} total employees at {world.company.name}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-[#2EC4B6]">
                    <AvatarFallback className="bg-gradient-to-br from-[#2EC4B6] to-[#1C2541] text-white">
                      {employeeInitials(employee)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl text-[#1C2541]">{employee.name}</h3>
                    <p className="text-gray-600">{employee.position}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/30">
                        {employee.department}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {employeeExperienceLabel(employee.yearsExperience)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Salary</div>
                    <div className="text-xl text-[#2EC4B6]">
                      {formatMoney(employee.salaryCents, currency)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Productivity</span>
                      <span className="text-sm text-[#1C2541]">{employee.productivity}%</span>
                    </div>
                    <Progress value={employee.productivity} className="h-2 bg-[#2EC4B6]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Creativity</span>
                      <span className="text-sm text-[#1C2541]">{employee.creativity}%</span>
                    </div>
                    <Progress value={employee.creativity} className="h-2 bg-[#F4B400]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Leadership</span>
                      <span className="text-sm text-[#1C2541]">{employee.leadership}%</span>
                    </div>
                    <Progress value={employee.leadership} className="h-2 bg-[#1C2541]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Loyalty</span>
                      <span className="text-sm text-[#1C2541]">{employee.loyalty}%</span>
                    </div>
                    <Progress value={employee.loyalty} className="h-2 bg-[#2EC4B6]" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white" disabled>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Promote
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" disabled>
                    <DollarSign className="w-4 h-4 mr-1" />
                    Raise
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" disabled>
                    <Award className="w-4 h-4 mr-1" />
                    Train
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
