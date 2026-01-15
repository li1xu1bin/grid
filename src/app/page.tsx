/* src/app/page.tsx */
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

// --- Types ---
type Character = {
  id: number;
  name: string;
  img: string;
};

type TeamMember = Character & {
  chain: number;
};

type Team = {
  id: number;
  name: string;
  score: string;
  members: TeamMember[];
};

// --- Mock Data ---
const CHARACTERS: Character[] = [
  { id: 1, name: "弗洛洛", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" },
  { id: 2, name: "仇远", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka" },
  { id: 3, name: "维里奈", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Willow" },
  { id: 4, name: "忌炎", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jiyan" },
  { id: 5, name: "吟霖", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Yinlin" },
  { id: 6, name: "安可", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anke" },
  { id: 7, name: "卡卡罗", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kakalo" },
  { id: 8, name: "鉴心", img: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jianxin" },
];

const CHAIN_MAP = ["零链", "一链", "二链", "三链", "四链", "五链", "六链"];
const CHINESE_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

// --- Components ---

// 1. 卡片组件
function TeamCard({ team, onDelete }: { team: Team; onDelete: (id: number) => void; }) {
  return (
    <div className="team-card" style={{position: 'relative'}}>
      <div className="team-info">
        <div className="team-name">{team.name}</div>
        <div className="team-score">{team.score}</div>
      </div>
      <div className="flex items-center">
        <div className="hero-group">
          {team.members.map((member, idx) => (
            <div key={idx} className="hero-avatar-container">
              <div className="hero-ring">
                <img src={member.img} className="hero-img" alt={member.name} />
              </div>
              <div className="chain-tag">{CHAIN_MAP[member.chain]}</div>
              <div className="name-tag">{member.name}</div>
            </div>
          ))}
        </div>
      </div>
      <button 
          onClick={() => onDelete(team.id)} 
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-white/10 transition-colors"
          aria-label={`删除队伍 ${team.name}`}
        >
          <Trash2 size={16} />
        </button>
    </div>
  );
}

// 2. 主页面
export default function Home() {
  // 状态：队伍列表
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "队伍一",
      score: "2220",
      members: [
        { ...CHARACTERS[0], chain: 2 },
        { ...CHARACTERS[1], chain: 0 },
        { ...CHARACTERS[2], chain: 3 },
      ],
    },
  ]);

  // 状态：弹窗控制
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharListOpen, setIsCharListOpen] = useState(false);
  
  // 状态：正在编辑的新队伍数据
  const [score, setScore] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<(TeamMember | null)[]>([null, null, null]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);

  // 打开主弹窗
  const handleOpenModal = () => {
    setScore("");
    setSelectedMembers([null, null, null]);
    setIsModalOpen(true);
  };

  // 保存队伍
  const handleSave = () => {
    if (!score) return alert("请填写分数");
    if (selectedMembers.some((m) => m === null)) return alert("请完整选择3个角色");

    const newTeamCount = teams.length + 1;
    const teamName = `队伍${CHINESE_NUM[newTeamCount] || newTeamCount}`;

    const newTeam: Team = {
      id: Date.now(),
      name: teamName,
      score,
      members: selectedMembers as TeamMember[],
    };

    setTeams([...teams, newTeam]);
    setIsModalOpen(false);
  };

  // 删除队伍
  const handleDeleteTeam = (id: number) => {
    if (window.confirm("确定要删除这个队伍吗？")) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  // 打开角色选择
  const handleSlotClick = (index: number) => {
    setCurrentSlotIndex(index);
    setIsCharListOpen(true);
  };

  // 选中角色
  const handleSelectChar = (char: Character) => {
    if (currentSlotIndex === null) return;
    
    const newMembers = [...selectedMembers];
    newMembers[currentSlotIndex] = { ...char, chain: 0 }; // 默认0链
    setSelectedMembers(newMembers);
    setIsCharListOpen(false);
  };

  // 修改链度
  const handleChainChange = (index: number, chain: number) => {
    const newMembers = [...selectedMembers];
    if (newMembers[index]) {
      newMembers[index] = { ...newMembers[index]!, chain };
      setSelectedMembers(newMembers);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>深境之塔 / 队伍记录</h2>
      </div>

      <div id="team-list">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onDelete={handleDeleteTeam} />
        ))}
      </div>

      {/* 悬浮添加按钮 */}
      <button className="fab-btn" onClick={handleOpenModal}>
        +
      </button>

      {/* 弹窗遮罩 */}
      {isModalOpen && (
        <div className="modal-overlay" id="addModal" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal" style={{position: 'relative', overflow: 'hidden'}}>
            <h3>添加新记录</h3>
            <div className="form-group">
              <label className="form-label">深塔分数</label>
              <input
                type="number"
                className="form-input"
                id="scoreInput"
                placeholder="例如：2220"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>

            <label className="form-label">选择角色配置 (点击头像更换)</label>
            <div className="char-selector-row">
              {selectedMembers.map((member, index) => (
                <div
                  key={index}
                  id={`slot-${index}`}
                  className={`char-slot ${member ? "filled" : ""}`}
                  onClick={() => handleSlotClick(index)}
                >
                  {member ? (
                    <>
                      <img src={member.img} className="slot-avatar" alt={member.name} />
                      <span className="slot-name" style={{ fontSize: "12px" }}>{member.name}</span>
                      <select
                        className="chain-select"
                        id={`chain-${index}`}
                        value={member.chain}
                        onClick={(e) => e.stopPropagation()} // 防止触发 slot click
                        onChange={(e) => handleChainChange(index, Number(e.target.value))}
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n}链</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <div className="placeholder-img slot-avatar" style={{width: 40, height: 40, borderRadius: '50%', background: '#555'}}>+</div>
                      <span className="slot-name" style={{ fontSize: "12px" }}>选择</span>
                       <select className="chain-select" id={`chain-${index}`} onClick={(e) => e.stopPropagation()} style={{display:'none'}}>
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n}链</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>取消</button>
              <button className="btn btn-confirm" onClick={handleSave}>保存</button>
            </div>

            {/* 内部弹层：角色列表 */}
            {isCharListOpen && (
              <div className="char-list-overlay" id="charListOverlay">
                <h4 style={{ textAlign: "center", marginBottom: "10px", color: "#fff" }}>选择角色</h4>
                <div className="char-grid" id="charGrid">
                  {CHARACTERS.map((char) => (
                    <div key={char.id} className="char-item" onClick={() => handleSelectChar(char)}>
                      <img src={char.img} alt={char.name} />
                      <span>{char.name}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-cancel"
                  style={{ marginTop: "10px", padding: "8px" }}
                  onClick={() => setIsCharListOpen(false)}
                >
                  返回
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
